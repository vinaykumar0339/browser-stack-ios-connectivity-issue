require('dotenv').config();
const { remote } = require('webdriverio');

// Mobile App BrowserStack configuration
const capabilities = {
    'bstack:options': {
        userName: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        buildName: 'Mobile App Build',
        sessionName: 'iOS Mobile App Test',
        interactiveDebugging: true
    },
    platformName: 'iOS',
    'appium:platformVersion': '16',
    'appium:deviceName': 'iPhone 14',
    'appium:automationName': 'XCUITest',
    'appium:app': 'bs://app_id',
    'appium:bundleId': '<bundle-id>',
    'appium:autoAcceptAlerts': false,
    'appium:forceAppLaunch': false,
    'appium:noReset': false,
    'appium:settings[snapshotMaxDepth]': 60,
};

const localCapabilities = {
    "platformName": "iOS",
    "appium:platformVersion": "16",
    "appium:deviceName": "iPhone 14",
    "appium:automationName": "XCUITest",
    "appium:bundleId": "<bundle-id>",
    "appium:autoAcceptAlerts": false,
    "appium:forceAppLaunch": false,
    "appium:noReset": false,
    "appium:settings[snapshotMaxDepth]": 60,
    "appium:udid": "<udid>",
    "appium:webDriverAgentUrl": "http://<ip-address>:8100"
}

async function runMobileTest() {
    console.log('Starting BrowserStack iOS mobile app automation test...');

    const driver = await remote({
        protocol: 'https',
        hostname: 'hub-cloud.browserstack.com',
        port: 443,
        path: '/wd/hub',
        capabilities
    });

    // local real device testing
    // const driver = await remote({
    //     hostname: 'localhost',
    //     port: 4723,
    //     capabilities: localCapabilities,
    // });

    try {
        // Wait for app to load
        await driver.pause(3000);
        console.log('iOS mobile app loaded successfully');

        // Example 1: Enter text in input field and click next (iOS specific)
        console.log('Example 1: iOS Text input and next button');

        // Find text input field using the provided iOS locator ID
        const textInput = driver.$('~login-form-text-input'); // Using provided iOS ID

        await textInput.waitForDisplayed({ timeout: 10000 });
        await textInput.setValue('jointsales@agency.com');
        console.log('Text entered in iOS input field');

        // Find and click login button using the provided iOS locator ID
        const loginButton = driver.$('//*[@name="NEXT-form-button"]'); // Using XPath for iOS


        await loginButton.waitForDisplayed({ timeout: 5000 });
        await loginButton.click();
        console.log('Login button clicked on iOS');

    } catch (error) {
        console.error('iOS mobile app test failed:', error);

        // Take screenshot on failure
        await driver.saveScreenshot('./ios-error-screenshot.png');

        // Mark test as failed
    } finally {
        await driver.deleteSession({ shutdownDriver: true });
        console.log('iOS mobile app session closed');
    }
}

// Run mobile app test
runMobileTest().catch(console.error);
