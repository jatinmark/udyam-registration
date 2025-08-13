const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function scrapeUdyamForm() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('Navigating to Udyam Registration page...');
    await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('Extracting form fields...');
    
    const formSchema = await page.evaluate(() => {
      const schema = {
        step1: {
          title: 'Aadhaar Verification',
          fields: [],
          validations: {}
        },
        step2: {
          title: 'PAN Verification',
          fields: [],
          validations: {}
        }
      };

      // Extract Step 1 - Aadhaar fields
      const aadhaarSection = document.querySelector('#ctl00_ContentPlaceHolder1_UpdatePanelAadhar');
      if (aadhaarSection) {
        // Aadhaar number field
        const aadhaarInput = aadhaarSection.querySelector('#ctl00_ContentPlaceHolder1_txtAadharNo');
        if (aadhaarInput) {
          schema.step1.fields.push({
            id: 'aadhaar',
            name: 'Aadhaar Number',
            type: 'text',
            placeholder: aadhaarInput.placeholder || 'Enter 12 digit Aadhaar Number',
            maxLength: 12,
            required: true,
            pattern: '^[0-9]{12}$'
          });
          schema.step1.validations.aadhaar = {
            pattern: '^[0-9]{12}$',
            message: 'Aadhaar number must be 12 digits'
          };
        }

        // Name as per Aadhaar field
        const nameInput = aadhaarSection.querySelector('#ctl00_ContentPlaceHolder1_txtNameAsPerAadhar');
        if (nameInput) {
          schema.step1.fields.push({
            id: 'nameAsPerAadhaar',
            name: 'Name as per Aadhaar',
            type: 'text',
            placeholder: 'Enter name as per Aadhaar',
            required: true,
            pattern: '^[a-zA-Z\\s]+$'
          });
          schema.step1.validations.nameAsPerAadhaar = {
            pattern: '^[a-zA-Z\\s]+$',
            message: 'Name should contain only letters and spaces'
          };
        }

        // Checkbox for declaration
        const checkboxLabel = aadhaarSection.querySelector('label[for="ctl00_ContentPlaceHolder1_chkDisclaimer"]');
        if (checkboxLabel) {
          schema.step1.fields.push({
            id: 'disclaimer',
            name: 'Declaration',
            type: 'checkbox',
            label: checkboxLabel.textContent.trim(),
            required: true
          });
        }

        // OTP field (appears after Aadhaar validation)
        schema.step1.fields.push({
          id: 'otp',
          name: 'OTP',
          type: 'text',
          placeholder: 'Enter OTP received on Aadhaar registered mobile',
          maxLength: 6,
          required: true,
          pattern: '^[0-9]{6}$',
          conditional: true,
          showAfter: 'aadhaarValidation'
        });
        schema.step1.validations.otp = {
          pattern: '^[0-9]{6}$',
          message: 'OTP must be 6 digits'
        };
      }

      // Extract Step 2 - PAN fields
      const panSection = document.querySelector('#ctl00_ContentPlaceHolder1_UpdatePanelPan');
      if (panSection) {
        // Type of Organisation dropdown
        const orgTypeDropdown = panSection.querySelector('#ctl00_ContentPlaceHolder1_ddlTypeofOrg');
        if (orgTypeDropdown) {
          const options = Array.from(orgTypeDropdown.options).map(opt => ({
            value: opt.value,
            label: opt.textContent
          }));
          
          schema.step2.fields.push({
            id: 'organisationType',
            name: 'Type of Organisation',
            type: 'select',
            options: options.filter(opt => opt.value !== '0'),
            required: true,
            placeholder: 'Select Type of Organisation'
          });
        }

        // PAN field
        const panInput = panSection.querySelector('#ctl00_ContentPlaceHolder1_txtPan');
        if (panInput) {
          schema.step2.fields.push({
            id: 'pan',
            name: 'PAN',
            type: 'text',
            placeholder: 'Enter PAN',
            maxLength: 10,
            required: true,
            pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
          });
          schema.step2.validations.pan = {
            pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
            message: 'PAN format should be like ABCDE1234F'
          };
        }

        // Mobile Number field
        const mobileInput = document.querySelector('#ctl00_ContentPlaceHolder1_txtMobileNo');
        if (mobileInput) {
          schema.step2.fields.push({
            id: 'mobile',
            name: 'Mobile Number',
            type: 'tel',
            placeholder: 'Enter Mobile Number',
            maxLength: 10,
            required: true,
            pattern: '^[6-9][0-9]{9}$'
          });
          schema.step2.validations.mobile = {
            pattern: '^[6-9][0-9]{9}$',
            message: 'Mobile number should be 10 digits starting with 6-9'
          };
        }

        // Email field
        const emailInput = document.querySelector('#ctl00_ContentPlaceHolder1_txtEmail');
        if (emailInput) {
          schema.step2.fields.push({
            id: 'email',
            name: 'Email ID',
            type: 'email',
            placeholder: 'Enter Email ID',
            required: true,
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          });
          schema.step2.validations.email = {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            message: 'Please enter a valid email address'
          };
        }

        // Social Category dropdown
        const socialCategoryDropdown = document.querySelector('#ctl00_ContentPlaceHolder1_ddlSocialCategory');
        if (socialCategoryDropdown) {
          const options = Array.from(socialCategoryDropdown.options).map(opt => ({
            value: opt.value,
            label: opt.textContent
          }));
          
          schema.step2.fields.push({
            id: 'socialCategory',
            name: 'Social Category',
            type: 'select',
            options: options.filter(opt => opt.value !== ''),
            required: true,
            placeholder: 'Select Social Category'
          });
        }

        // Gender radio buttons
        const genderRadios = document.querySelectorAll('input[name="ctl00$ContentPlaceHolder1$rblGender"]');
        if (genderRadios.length > 0) {
          const genderOptions = Array.from(genderRadios).map(radio => ({
            value: radio.value,
            label: radio.nextElementSibling ? radio.nextElementSibling.textContent : radio.value
          }));
          
          schema.step2.fields.push({
            id: 'gender',
            name: 'Gender',
            type: 'radio',
            options: genderOptions,
            required: true
          });
        }

        // Specially Abled radio buttons
        const speciallyAbledRadios = document.querySelectorAll('input[name="ctl00$ContentPlaceHolder1$rblPhysicallyHandicap"]');
        if (speciallyAbledRadios.length > 0) {
          const options = Array.from(speciallyAbledRadios).map(radio => ({
            value: radio.value,
            label: radio.nextElementSibling ? radio.nextElementSibling.textContent : radio.value
          }));
          
          schema.step2.fields.push({
            id: 'speciallyAbled',
            name: 'Specially Abled',
            type: 'radio',
            options: options,
            required: true
          });
        }

        // Name of Enterprise
        const enterpriseNameInput = document.querySelector('#ctl00_ContentPlaceHolder1_txtNameofEnterprise');
        if (enterpriseNameInput) {
          schema.step2.fields.push({
            id: 'enterpriseName',
            name: 'Name of Enterprise',
            type: 'text',
            placeholder: 'Enter Name of Enterprise',
            required: true
          });
        }
      }

      // Extract button information
      const buttons = {
        step1: {
          validateAadhaar: document.querySelector('#ctl00_ContentPlaceHolder1_btnValidateAadhar') ? 'Validate & Generate OTP' : null,
          verifyOTP: 'Verify OTP'
        },
        step2: {
          validateAndSave: document.querySelector('#ctl00_ContentPlaceHolder1_btnValidateAndSave') ? 'Validate & Save' : null
        }
      };

      schema.buttons = buttons;

      return schema;
    });

    // Save the scraped data to JSON file
    const outputDir = path.join(__dirname, '../data');
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, 'udyam-form-schema.json');
    await fs.writeFile(outputPath, JSON.stringify(formSchema, null, 2));
    
    console.log(`Form schema saved to: ${outputPath}`);
    console.log('\nScraped Form Schema:');
    console.log(JSON.stringify(formSchema, null, 2));

    return formSchema;

  } catch (error) {
    console.error('Error scraping form:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper
if (require.main === module) {
  scrapeUdyamForm()
    .then(() => {
      console.log('\nScraping completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Scraping failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapeUdyamForm };