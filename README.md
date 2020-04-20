# WEB-CLIENT

# Introduction:

This is the front-end of our project.

# CICD

## Server

This service should deploy on `ngnix`

## .ENV

Update your .env as per requirements in .env.dev

## Config

First change the variable `DEVELOPMENT_ENV` to false in config/config.js file.
Before deployment, make sure that node with version 10 or greater is installed on the machine.

# How to setup repository

### Follow these steps:

1.  npm install
2.  npm run build -> this will create a dist folder
3.  copy this dist folder to ms-middleware/

# Debugging Standards

#### 1. Add `DEVELOPMENT_ENV` in .env file

```bash
## Enable or Disable development environment, should be false in production environment
DEVELOPMENT_ENV = true
```

-   If you want logs in console tab then set `DEVELOPMENT_ENV` to true.
-   False in `DEVELOPMENT_ENV` will not show any information in console tab.

#### 2. Runtime Debugging in Web-Client

-   You can enable logs and other information of console tab runtime in development environment or in production environment by setting up <b>`debug`</b> to <b>`true`</b> from local storage tab and refresh.
-   You can disable console logs in both environments by setting <b>`false`</b> to <b>`debug`</b> in application/local storage tab.

# Logging Standards

#### 1. Use Proper Log Commands

To enhance development method we separated the a class for logging the events such as log, warning and error. Instead of using `console.log()` or `console.error()` you can simply write the `Console.log()` <b>(with capital C)</b>.

-   `Console.log()` should be used for logging any events, notifications, info or any success message.
-   `Console.warn()` should be used for logging warning messages in microservices.
-   `Console.error()` should be used for logging custom errors and exceptions.
-   `Console.exception()` should be used for exception logging.

#### 2. Add Proper LOG_TARGET in .env

```bash
# logging target should be "console" | "kibana" | "both"
LOG_TARGET = both
```

-   Set `console` for only showing logs in console.
-   Set `kibana` for only send logs to kibana, don't show in console.
-   Set `both` for both showing in console and sending to kibana.

## Steps for the installation and configuration of prettier & eslint

### Prettier

-   npm install prettier -D
-   Open Settings in vs code and search wordwrap
-   If wordwrap is off, simply on it
-   CTRL + Shift + P
-   Preferences: Configure language specific settings
-   Search Javascript
-   Add the following lines in the file

```bash
{
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "window.zoomLevel": 1,
    "javascript.updateImportsOnFileMove.enabled": "always",
    "explorer.confirmDelete": false,
    "debug.toolBarLocation": "docked",
    "debug.node.autoAttach": "on",
    "editor.wordWrap": "on",
    "[javascript]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true
    }
}
```

Create .pritterrc.js file in the root folder and add the following code

```bash
module.exports = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
}
```

### ESLINT

-   npm i -D eslint eslint-config-airbnb-base eslint-plugin-import

Create .eslintrc.js file in the root folder and add the following code

```bash
const { strictEslint } = require('@umijs/fabric');

module.exports = {
    ...strictEslint,
    globals: {
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
        page: true,
    },
};
```

-   Press Ctrl + Shift + X to open the Extensions panel in vscode.
-   Type ESLint in the search bar. Find the ESLint extension in the search results and click the green Install button next to it.
-   Go ahead and close VS Code and then re-open it.

## ECS Monitoring

-   Please set MONITORING_SOCKET_IP with the relavent IP of ms-ecs-monitoring server.

# Release List

## Release 0.15

| Issue Type | Issue key  | Summary                                                           |
| ---------- | ---------- | ----------------------------------------------------------------- |
| Bug        | CLOUD7-781 | usage report timer reset fix                                      |
| Bug        | CLOUD7-780 | Instance is not created without metadata                          |
| Task       | CLOUD7-779 | Create Release Task and Bug fix Sheet                             |
| Bug        | CLOUD7-790 | Fix UI in Edit image in image management service                  |
| Task       | CLOUD7-792 | Add colors in buttons of new features and also change color ...   |
| Bug        | CLOUD7-785 | Searchable Flavor and Volume Types in Create ECS                  |
| Bug        | CLOUD7-775 | After creating the group all remove user buttons are buffering... |
| Bug        | CLOUD7-766 | Remove hardcoded port from every microservice of DCM              |
| Bug        | CLOUD7-754 | when the user changes password ,logs out from the DCM             |
| Task       | CLOUD7-750 | Refactoring of Reserved ECS                                       |
| Sub-task   | CLOUD7-425 | CLOUD7-293 - Create & Connect Mongo DB for Micro-service          |
| Task       | CLOUD7-298 | Trial Account[FR5,FR6] - Removing customer account from trial...  |
| Task       | CLOUD7-297 | Trial Account task[FR3,FR4] - Out of 7 days for trial...          |
| Bug        | CLOUD7-783 | If the user click on project row and group row ,checkbox ...      |
| Bug        | CLOUD7-757 | When the user update flavors pricing ,the update buttons...       |
| Task       | CLOUD7-722 | Volume should be set w.r.t to the image                           |
| BUG        | CLOUD7-795 | while creating user the mail we get it not showing code mfa...    |

## Release 0.14

| Issue Type | Issue key  | Summary                                                           |
| ---------- | ---------- | ----------------------------------------------------------------- |
| Bug        | CLOUD7-776 | Fixed report collector queue name and usage-report catch block    |
| Bug        | CLOUD7-740 | No DCM logs are displayed in rabbitMQ queue (nova & neutron)      |
| Bug        | CLOUD7-769 | HOTFIX: Rollback Security delect CLOUD7-597                       |
| Task       | CLOUD7-765 | Disable KMS for production                                        |
| Task       | CLOUD7-764 | Add Strong Password Complexity for User                           |
| Task       | CLOUD7-712 | MFA QR to be sent via email to the user when a user is created.   |
| Task       | CLOUD7-695 | Roles menu are not available                                      |
| Task       | CLOUD7-682 | No Instances count option available during the instance creation  |
| Task       | CLOUD7-680 | Metadata options is not available while creating the Instances    |
| Task       | CLOUD7-679 | Most of the Project Quota Settings are not available like         |
| Sub-task   | CLOUD7-425 | CLOUD7-293 - Create & Connect Mongo DB for Micro-service          |
| Bug        | CLOUD7-771 | The message is not appropriate when the user changed the password |
| Bug        | CLOUD7-756 | Remove full stops from everywhere in DCM                          |

## Release 0.13

| Issue Type | Issue key  | Summary                                                                           |
| ---------- | ---------- | --------------------------------------------------------------------------------- |
| Bug        | CLOUD7-748 | Remove space in name validation from all fields                                   |
| Bug        | CLOUD7-749 | Fix create subnet from backend (MS-OPENSTACK)                                     |
| Bug        | CLOUD7-739 | When try to detach network inside the vm there is no loader set ...               |
| Bug        | CLOUD7-709 | [API] No validation in names through API                                          |
| Task       | CLOUD7-597 | Add Security Capcha and password at Delete Project                                |
| Bug        | CLOUD7-753 | Build issue in QA and UAT                                                         |
| Task       | CLOUD7-752 | While selecting flavor, it should be searchable                                   |
| Bug        | CLOUD7-751 | when the user extends volume it starts from 50 gb ,while at the time of volume... |
| Bug        | CLOUD7-746 | Make same format for spellings                                                    |
| Bug        | CLOUD7-744 | Exactly notify the logo and loader                                                |
| Bug        | CLOUD7-743 | Remove unwanted network calls from dashboard                                      |
| Bug        | CLOUD7-738 | Fix Forms of antd                                                                 |
| Sub-task   | CLOUD7-425 | CLOUD7-293 - Create & Connect Mongo DB for Micro-service                          |

## Release 0.12

| Issue Type | Issue key  | Summary                                                                               |
| ---------- | ---------- | ------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-732 | Install Firehose in RabbitMQ                                                          |
| Bug        | CLOUD7-737 | Remove OpenPort Place holder & resolve the tooltip issue                              |
| Bug        | CLOUD7-721 | Boot volume should be 50 GB                                                           |
| Bug        | CLOUD7-720 | At the time of volume creation minimum volume size should be 5 GB                     |
| Bug        | CLOUD7-719 | Do not allow spaces in instances name .                                               |
| Bug        | CLOUD7-669 | [API] When we create network through api it is not updating automatically in network… |
| Bug        | CLOUD7-636 | Make authorization while enabling the MFA in user list                                |
| Bug        | CLOUD7-610 | unable to assign elastic ip                                                           |
| Bug        | CLOUD7-741 | Revert Version 4 of antd                                                              |
| Bug        | CLOUD7-734 | Fix the Redo / Refresh Button Defect                                                  |
| Story      | CLOUD7-730 | Fix Version Issues in build package.json                                              |
| Bug        | CLOUD7-711 | No button to refresh list                                                             |
| Bug        | CLOUD7-701 | Volumes Menu is showing error message                                                 |
| Bug        | CLOUD7-685 | Associate Floating IP option is missing                                               |
| Bug        | CLOUD7-663 | while detaching the security group from ecs it loading on every security group        |
| Task       | CLOUD7-588 | In all dcm buttons should be in blue and red color .                                  |
| Task       | CLOUD7-502 | Add Comments on .env.dev for all repositories                                         |
| Task       | CLOUD7-436 | Update README.md for CICD                                                             |
| Sub-task   | CLOUD7-425 | CLOUD7-293 - Create & Connect Mongo DB for Micro-service                              |

## Release 0.11

| Issue Type | Issue key  | Summary                                                                                      |
| ---------- | ---------- | -------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-665 | Update Docker File in collector                                                              |
| Bug        | CLOUD7-705 | Extending Volume is giving error                                                             |
| Bug        | CLOUD7-676 | [API] No need of CIDR while creating security group rule,but in dcm it is required to add... |
| Bug        | CLOUD7-657 | when we resizing one instance it disable the to resize another instance until 1 instance...  |
| Bug        | CLOUD7-656 | wile resizing the instance it show error and resize it                                       |
| Bug        | CLOUD7-647 | [API] while updating subnet, enable gateway is not turning off at dcm but status...          |
| Bug        | CLOUD7-639 | Unable to delete reserve instance while it is in error estate                                |
| Bug        | CLOUD7-638 | when deleting volume in bulk errors appear.                                                  |
| Bug        | CLOUD7-612 | By clicking on this server it showing errors please check images                             |
| Bug        | CLOUD7-609 | Unable to delete fix Ip                                                                      |
| Bug        | CLOUD7-591 | Ecs monitoring is not working                                                                |
| Bug        | CLOUD7-538 | [API] In API testing "GET" request is also taking "POST" as a HTTP verb while the user...    |
| Bug        | CLOUD7-526 | After creating VM ,user is unable to delete volume for the first time ...                    |
| Bug        | CLOUD7-700 | Creating Volume is not working                                                               |
| Bug        | CLOUD7-697 | Security Groups Options needs to be revised (hints should be available to describe ...       |
| Bug        | CLOUD7-696 | project menu is showing only 1 project, the rest of projects assigned to the user...         |
| Bug        | CLOUD7-693 | Hints are Required for the DHCP pool to show how the syntax should be for the Pool ...       |
| Bug        | CLOUD7-688 | Extend Volumes option is not working                                                         |
| Bug        | CLOUD7-686 | Instance resizing option is missing                                                          |
| Bug        | CLOUD7-678 | External Version number                                                                      |
| Bug        | CLOUD7-674 | showing error when we resizing vm                                                            |
| Task       | CLOUD7-673 | (Duplicate) filter flavor by option (e.g ondemand, reserved, linux, windows)while ...        |
| Bug        | CLOUD7-668 | Made Billing Tab Visible on DCM                                                              |
| Bug        | CLOUD7-646 | unable to close drop down menu                                                               |
| Bug        | CLOUD7-631 | when deleting a security group rule ,all delete buttons are buffering.                       |
| Sub-task   | CLOUD7-627 | Integrate logger in "ms-openstack"                                                           |
| Sub-task   | CLOUD7-626 | Integrate logger in "ms-hystax"                                                              |
| Sub-task   | CLOUD7-622 | Integrate logger in "ms-usage-report"                                                        |
| Sub-task   | CLOUD7-605 | Integrate logger in "ms-middleware"                                                          |
| Sub-task   | CLOUD7-604 | Integrate logger in "ms-ecs-monitoring"                                                      |
| Bug        | CLOUD7-473 | when volume has been created it should redirects the user to the volume list...              |
| Sub-task   | CLOUD7-351 | authentication with middleware and finding domain settings from ms-settings                  |
| Task       | CLOUD7-345 | Change Password Option                                                                       |
| Sub-task   | CLOUD7-326 | generate json of pricing from detasad pricing document                                       |
| Task       | CLOUD7-312 | FR-1 : List the price plan for each service at the time of its creation...                   |
| Story      | CLOUD7-279 | FR2: Ability to export the usage report into an PDF                                          |
| Bug        | CLOUD7-671 | please make desktop icon same as in service                                                  |
| Bug        | CLOUD7-642 | when while creating new instance it showing 1_year plan in type column in building ...       |

## Release 1.0

| Issue Type | Issue key  | Summary                                                                                      |
| ---------- | ---------- | -------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-651 | Update Docker File in Usage Report Collector                                                 |
| Bug        | CLOUD7-650 | The icons of security and storage are same and icons of compute ,billing and IAM...          |
| Bug        | CLOUD7-649 | resize the spellings in all of them                                                          |
| Bug        | CLOUD7-634 | docker and requirements file (updated) in usage collector                                    |
| Sub-task   | CLOUD7-627 | Integrate logger in "ms-openstack"                                                           |
| Sub-task   | CLOUD7-622 | Integrate logger in "ms-usage-report"                                                        |
| Bug        | CLOUD7-620 | Handle middleware for /api/v1/service/compute/list route when ms-reserve-ecs fails           |
| Bug        | CLOUD7-607 | MFA login route not going through middleware                                                 |
| Bug        | CLOUD7-606 | Unable to submit interface in routers .                                                      |
| Sub-task   | CLOUD7-605 | Integrate logger in "ms-middleware"                                                          |
| Sub-task   | CLOUD7-604 | Integrate logger in "ms-ecs-monitoring"                                                      |
| Bug        | CLOUD7-598 | [API] Unable to reflect changes when deleting router from API                                |
| Bug        | CLOUD7-596 | When the user logs out error appears something went wrong                                    |
| Bug        | CLOUD7-595 | Update subnet button is not working after creating subnet .                                  |
| Bug        | CLOUD7-593 | No validations when creating subnet .                                                        |
| Bug        | CLOUD7-592 | when deleting a single subnet all are buffering .                                            |
| Bug        | CLOUD7-589 | when deleting a single port all ports are buffering .                                        |
| Bug        | CLOUD7-583 | Remove the support option for admin                                                          |
| Bug        | CLOUD7-582 | Remove domain option if there no domain scope further.                                       |
| Bug        | CLOUD7-578 | All delete buttons are buffering when deleting just one port                                 |
| Bug        | CLOUD7-575 | [API ] Unable to "delete port "but status code is 200 .                                      |
| Bug        | CLOUD7-565 | After creating security group rule ,the color of button is not changing and data is not      |
| Bug        | CLOUD7-560 | [API] Unable to create new things through Api from web client                                |
| Bug        | CLOUD7-550 | [API] Full stops ,commas and inverted commas are acceptable at the end of a route .          |
| Bug        | CLOUD7-548 | [API] Must not accept two slashes in URL .                                                   |
| Bug        | CLOUD7-547 | [API] The message should be "Request method is invalid ".                                    |
| Bug        | CLOUD7-530 | Error while creating volume                                                                  |
| Bug        | CLOUD7-491 | FIX THE POSITION OF HEADING                                                                  |
| Task       | CLOUD7-488 | ms-emailer                                                                                   |
| Bug        | CLOUD7-455 | Data is Missing In Availability Zone                                                         |
| Bug        | CLOUD7-376 | Unable to generate Usage Report                                                              |
| Bug        | CLOUD7-375 | Unable to Use Contact us.                                                                    |
| Bug        | CLOUD7-356 | Button is Not Working to Enable MFA                                                          |
| Task       | CLOUD7-346 | Create an automated deployed and release script                                              |
| Sub-task   | CLOUD7-326 | generate json of pricing from detasad pricing document                                       |
| Task       | CLOUD7-296 | Volume Encryption - FR1[3days]: An option to encrypt EVS volume at the time of its creation. |
| Story      | CLOUD7-286 | MFA - FR3: Feature to ask for an MFA token after traditional credentials...                  |

## Release 0.9

| Issue Type | Issue key  | Summary                                                                                      |
| ---------- | ---------- | -------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-580 | Unable to see KMS                                                                            |
| Bug        | CLOUD7-576 | Usage Report Middleware Branch Q4-2010                                                       |
| Task       | CLOUD7-572 | Deploy Ms-emailer                                                                            |
| Bug        | CLOUD7-569 | Scroll bar is vanished from everywhere .                                                     |
| Bug        | CLOUD7-564 | Remove Dashboard from domain scope .                                                         |
| Bug        | CLOUD7-558 | Unable to create key                                                                         |
| Bug        | CLOUD7-556 | [API] Unable to create port .                                                                |
| Bug        | CLOUD7-544 | Showing Error in KMS when ever refreshing the page and Unable to create key                  |
| Task       | CLOUD7-534 | No option to create snapshot .                                                               |
| Bug        | CLOUD7-533 | Not able to increase volume size ,after creating vm                                          |
| Bug        | CLOUD7-531 | NOT REFRESHING AUTOMATICALLY WHEN CREATING NEW INSTANCE AND VOLUME                           |
| Bug        | CLOUD7-517 | when creating new project with the name of existing project ,it shows error ...              |
| Bug        | CLOUD7-515 | Actual role should display in account instead of every role                                  |
| Bug        | CLOUD7-344 | No Validation While Creating New User                                                        |
| Task       | CLOUD7-259 | RabbitMQ integration with microservice                                                       |
| Bug        | CLOUD7-602 | Remove availability zones option for creating volume                                         |
| Bug        | CLOUD7-599 | Change https to http in Ecs monitoring                                                       |
| Task       | CLOUD7-590 | Create subnet ,Delete and update subnet buttons must be in blue color                        |
| Bug        | CLOUD7-579 | Middlware - Change localhost to process.env in mail.js                                       |
| Bug        | CLOUD7-570 | Buffering when clicked on "Ports"                                                            |
| Task       | CLOUD7-566 | Delete Domain work                                                                           |
| Task       | CLOUD7-561 | Update service endpoints programatically                                                     |
| Task       | CLOUD7-554 | Remove Domain (Project Level Segregation)                                                    |
| Task       | CLOUD7-385 | MFA - Middleware                                                                             |
| Task       | CLOUD7-372 | Admin can edit or to give privileges to any members (Admin portal version 1)                 |
| Task       | CLOUD7-371 | Create Login with Cloud Admin Scope(Admin Portal version 1)                                  |
| Task       | CLOUD7-368 | Create Group and list Groups(Admin Portal version 1)                                         |
| Task       | CLOUD7-367 | Create User and list users (Admin Portal version 1)                                          |
| Task       | CLOUD7-366 | Create projects and list projects (Admin Portal version 1)                                   |
| Story      | CLOUD7-288 | FR1: Ability to view graph for CPU utilization of an ECS instance by its tenant...           |
| Story      | CLOUD7-287 | MFA - FR4: Ability to configure multiple authenticator applications (devices) with...        |
| Story      | CLOUD7-285 | MFA - FR2: When MFA is enabled, ability to scan a barcode or enter a key to configure MFA... |
| Story      | CLOUD7-282 | MFA- FR1: Feature to enable/disable MFA in DCM customer portal.                              |
| Story      | CLOUD7-275 | FR5: Ability to provision Reserved Instances.                                                |
| Task       | CLOUD7-267 | ECS Monitoring - Kafka Integration                                                           |
| Task       | CLOUD7-153 | Integrate Kibana as Logger in DCM                                                            |
| Task       | CLOUD7-52  | Microservice - Usage Report                                                                  |
| BUG        | CLOUD7-607 | MFA login route not going through middleware                                                 |

## Release 0.8

| Issue Type | Issue key  | Summary                                                                                      |
| ---------- | ---------- | -------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-531 | NOT REFRESHING AUTOMATICALLY WHEN CREATING NEW INSTANCE AND VOLUME                           |
| Bug        | CLOUD7-511 | Support link is missing from navbar                                                          |
| Bug        | CLOUD7-512 | No projects in group list .                                                                  |
| Bug        | CLOUD7-468 | Remove click able link in the picture ,remove dashboard option...                            |
| Bug        | CLOUD7-543 | No Validation in KMS name field                                                              |
| Task       | CLOUD7-562 | Update .env.dev of ms-middleware for jenkins                                                 |
| Task       | CLOUD7-546 | Update .env.dev for kms service                                                              |
| Task       | CLOUD7-555 | Remove Advance Settings collapsible menu from Project and show Compute Quota as default      |
| Task       | CLOUD7-545 | Deploy kms microservice                                                                      |
| Bug        | CLOUD7-528 | Make proper validation of all of them like network name                                      |
| Bug        | CLOUD7-539 | HOTFIX: Fix Release Number in .env.dev                                                       |
| Bug        | CLOUD7-514 | Data is storing in only in one page and data is not in order list                            |
| Bug        | CLOUD7-404 | No Validation While Creating New Network                                                     |
| Bug        | CLOUD7-542 | Security Tab is not visible                                                                  |
| Task       | CLOUD7-270 | FR1: Ability to create a key by the customer.                                                |
| Sub-task   | CLOUD7-319 | (KMS) Create Detail KMS component along with kms model and also working submit button...     |
| Sub-task   | CLOUD7-325 | (KMS) create KMS microservice and also integrate it with web-client                          |
| Sub-task   | CLOUD7-324 | (KMS) Add delete options in KMS along with its methods in kms model and also create open ... |
| Story      | CLOUD7-383 | Remove OpenAPISpec                                                                           |
| Bug        | CLOUD7-529 | Fetching Ports                                                                               |
| Task       | CLOUD7-522 | Horizon vs DCM functionalities list                                                          |
| Task       | CLOUD7-443 | Add co-branding image in web-client                                                          |
| Bug        | CLOUD7-518 | Two alert boxes in error state are appearing when increasing volume size .                   |
| Sub-task   | CLOUD7-326 | generate json of pricing from detasad pricing document                                       |
| Task       | CLOUD7-112 | integrate monasca                                                                            |
| Sub-task   | CLOUD7-318 | (KMS) Research on the KMS and also create components for displaying all Keys ...             |
| Sub-task   | CLOUD7-288 | FR1: Ability to view graph for CPU utilization of an ECS instance by its tenant ...          |
| Sub-task   | CLOUD7-474 | ECS Monitoring - Services Integration                                                        |
| Bug        | CLOUD7-531 | NOT REFRESHING AUTOMATICALLY WHEN CREATING NEW INSTANCE AND VOLUME                           |
| Sub-task   | CLOUD7-371 | Create Login with Cloud Admin Scope(Admin Portal version 1)                                  |
| Task       | CLOUD7-22  | Q2 2020 - Admin Portal (Version 1)                                                           |

|

## Release 0.7

| Issue Type | Issue key  | Summary                                                                                     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-518 | Two alert boxes in error state are appearing when increasing volume size .                  |
| Task       | CLOUD7-439 | Change dashboard graphs to biz-charts                                                       |
| Bug        | CLOUD7-510 | Data is missing from one column of project tab.                                             |
| Bug        | CLOUD7-509 | It Should Not Accept Numbers ,Special Characters and Space in Name Field                    |
| Bug        | CLOUD7-404 | No Validation While Creating New Network                                                    |
| Bug        | CLOUD7-493 | FIX THE MAIN SCREEN                                                                         |
| Task       | CLOUD7-497 | taking snap of side by side logo                                                            |
| Bug        | CLOUD7-507 | HOTFIX: Remove unwanted files and fix routes in config.js                                   |
| Bug        | CLOUD7-492 | HOTFIX: Fix config.js and env according to theDevOps requirement                            |
| Bug        | CLOUD7-489 | when creating VM static error at disk size .                                                |
| Task       | CLOUD7-417 | All microservices must have .env file                                                       |
| Sub-task   | CLOUD7-326 | generate json of pricing from detasad pricing document                                      |
| Task       | CLOUD7-482 | Hotfix for footer                                                                           |
| Bug        | CLOUD7-471 | NO validation when creating volume .                                                        |
| Bug        | CLOUD7-469 | No validation when creating snapshot .                                                      |
| Sub-task   | CLOUD7-318 | (KMS) Research on the KMS and also create components for displaying all Keys and create KMS |

## Release 0.6

| Issue Type | Issue key  | Summary                                                                                     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-453 | Remove dashboard link to Navbar                                                             |
| Bug        | CLOUD7-375 | Unable to Use Contact us.                                                                   |
| Bug        | CLOUD7-467 | Hot fix some issues                                                                         |
| Bug        | CLOUD7-466 | when a user login first time ,these errors are showing.                                     |
| Bug        | CLOUD7-362 | Unauthorized action when creating new group with project admin .                            |
| Bug        | CLOUD7-360 | As project admin has no right to create new project so hide or remove this for the user .   |
| Bug        | CLOUD7-456 | Change The Status Color Mark                                                                |
| Bug        | CLOUD7-341 | Network-Routing-Shows No Data in External Network                                           |
| Bug        | CLOUD7-396 | Project admin cannot decrease the volume size ,after creating the volume .                  |
| Task       | CLOUD7-434 | add .gitignore file to all microservices                                                    |
| Bug        | CLOUD7-465 | Display error messages on login page                                                        |
| Bug        | CLOUD7-252 | public router created successfully with horizon (R&D required)                              |
| Task       | CLOUD7-349 | Make a release                                                                              |
| Bug        | CLOUD7-454 | Remove duplicate .env.dev                                                                   |
| Task       | CLOUD7-440 | Refactor config.js and separate routes                                                      |
| Story      | CLOUD7-329 | Remove commented code                                                                       |
| Sub-task   | CLOUD7-318 | (KMS) Research on the KMS and also create components for displaying all Keys and create KMS |

## Release 0.5

| Issue Type | Issue key  | Summary                                                                                                                                             |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-256 | Network create error                                                                                                                                |
| Story      | CLOUD7-334 | Domain default settings Population for ms-settings                                                                                                  |
| Task       | CLOUD7-389 | Disable the option for domain admin to create new VM instance                                                                                       |
| Bug        | CLOUD7-354 | Not Able Creating New User With project Admin                                                                                                       |
| Bug        | CLOUD7-398 | User Cannot create router from domain admin                                                                                                         |
| Story      | CLOUD7-347 | initialize script for mongodb                                                                                                                       |
| Sub-task   | CLOUD7-326 | generate json of pricing from detasad pricing document                                                                                              |
| Bug        | CLOUD7-395 | User cannot delete volume unless he didn't delete snapshot .                                                                                        |
| Bug        | CLOUD7-343 | External Network Listing Issue on EIP Creation                                                                                                      |
| Sub-task   | CLOUD7-318 | (KMS) Research on the KMS and also create components for displaying all Keys and create KMS                                                         |
| Task       | CLOUD7-427 | Hide incomplete components from view                                                                                                                |
| Bug        | CLOUD7-408 | Make Validation in the Name Field                                                                                                                   |
| Bug        | CLOUD7-442 | Pop Message in Release Elastic IP                                                                                                                   |
| Bug        | CLOUD7-428 | Remove Error From Dashboard from Domain login                                                                                                       |
| Bug        | CLOUD7-357 | Data is Missing in Account_Format                                                                                                                   |
| Bug        | CLOUD7-396 | Project admin cannot decrease the volume size ,after creating the volume .                                                                          |
| Bug        | CLOUD7-407 | Remove The Option to Create New Network for Domain Admin.                                                                                           |
| Bug        | CLOUD7-249 | Domain admin is able to view all the routers, even the routers of different domains                                                                 |
| Bug        | CLOUD7-250 | Domain admin is able to view all the elastic ips(Horizon) when not assign to any project                                                            |
| Bug        | CLOUD7-392 | Domain admin cannot create volume and snapshots so why there option for him to create .                                                             |
| Bug        | CLOUD7-248 | domain admin cannot modify quota of a project (Horizon)                                                                                             |
| Bug        | CLOUD7-352 | Missing Data in Users list                                                                                                                          |
| Bug        | CLOUD7-361 | All fields must be required to create the group .                                                                                                   |
| Task       | CLOUD7-406 | Add Rules in Eslint                                                                                                                                 |
| Bug        | CLOUD7-431 | Place The Drop Down list of "Projects" In navigation bar to Select projects beside services,it showing below identity .                             |
| Bug        | CLOUD7-441 | Update Readme.md on Tools repo                                                                                                                      |
| Bug        | CLOUD7-151 | UI Code Bugfix (CLOUD7-135)                                                                                                                         |
| Story      | CLOUD7-274 | FR3: Provide customer the option to select payment mode, i.e. No Upfront, Partial Upfront, Full Upfront. (This should reflect the rate accordingly) |
| Story      | CLOUD7-273 | FR2: Provide customer with options to select between 1 or 3 years RIs (term period)                                                                 |
| Bug        | CLOUD7-378 | Pricing Plan Data Are Not Showing Properly                                                                                                          |
| Bug        | CLOUD7-355 | No Security in User list With Project Admin                                                                                                         |
| Bug        | CLOUD7-382 | (Duplicate) - Billing is not working properly                                                                                                       |
| Bug        | CLOUD7-135 | UI and Code Bug Fix (Q4-2019-Testing DCM)                                                                                                           |
| Bug        | CLOUD7-344 | No Validation While Creating New User                                                                                                               |
| Bug        | CLOUD7-342 | Network-Region Creation Error                                                                                                                       |
| Bug        | CLOUD7-380 | Domain admin cannot see the dashboard                                                                                                               |
| Bug        | CLOUD7-437 | Fix package.json                                                                                                                                    |
| Bug        | CLOUD7-397 | When creating router from project admin ,"Name" is not validated                                                                                    |
| Bug        | CLOUD7-375 | Unable to Use Contact us.                                                                                                                           |
| Bug        | CLOUD7-388 | Showing Relevant Error After the VM instance created                                                                                                |
| Bug        | CLOUD7-379 | When we click on "Billing" it redirects to overview and nothing is showing there .                                                                  |
| Bug        | CLOUD7-377 | Not Able To Access Invoices                                                                                                                         |
| Bug        | CLOUD7-381 | Search icon is not working and nothing to show in usage data frames                                                                                 |
| Bug        | CLOUD7-376 | Unable to generate Usage Report                                                                                                                     |
| Bug        | CLOUD7-387 | Not Able to Create New VM Instance                                                                                                                  |
| Task       | CLOUD7-429 | Script that will set all necessary IP addresses and run micro services.                                                                             |
| Bug        | CLOUD7-412 | IP address hard coded in IAM microservice.                                                                                                          |
| Bug        | CLOUD7-416 | Fix Release heading from 0.0.3 to 0.0.4                                                                                                             |
| Bug        | CLOUD7-420 | Hardcoded ip addresss in middleware                                                                                                                 |
| Bug        | CLOUD7-358 | Project name must be in proper format .                                                                                                             |
| Bug        | CLOUD7-394 | When volume has been created it shows created five hours ago every time .                                                                           |
| Sub-task   | CLOUD7-138 | SubTask-2 of Ticket CLOUD7-135                                                                                                                      |
| Sub-task   | CLOUD7-143 | SubTask-3 of Ticket CLOUD7-135                                                                                                                      |
| Sub-task   | CLOUD7-137 | SubTask-1 of Ticket CLOUD7-135                                                                                                                      |

## Release 0.0.4

| Issue Type | Issue Key  | Summary                                                                                     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-410 | Resolve Conflict code in Develop branch                                                     |
| Sub-task   | CLOUD7-400 | ECS Monitoring - Create Authentication method of micro service from IAM                     |
| Sub-task   | CLOUD7-399 | ECS Monitoring - Create separate configuration file with .env                               |
| Story      | CLOUD7-386 | configure DCM for cloud7 demo.                                                              |
| Story      | CLOUD7-373 | Install and configure prettier and eslint in web-client                                     |
| Bug        | CLOUD7-363 | Create instance Bug                                                                         |
| Task       | CLOUD7-333 | Usage Report - Add Search and Export Button separetely                                      |
| Sub-task   | CLOUD7-318 | (KMS) Research on the KMS and also create components for displaying all Keys and create KMS |
| Story      | CLOUD7-280 | FR3: By default, the report should show last 30 days usage.                                 |
| Bug        | CLOUD7-339 | Billing-Formatting Issue                                                                    |

## Release 0.0.3

| Issue Type | Issue Key  | Summary                                                                                            |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------- |
| Bug        | CLOUD7-337 | Bug in config.js                                                                                   |
| Bug        | CLOUD7-335 | Billing pages break due to conflicts resolution                                                    |
| Sub-task   | CLOUD7-318 | (KMS) Research on the KMS and also create components for displaying all Keys and create KMS        |
| Bug        | CLOUD7-307 | Usage Report - Remove csvjson and fix error handling                                               |
| Bug        | CLOUD7-299 | BUG - Generic Service changes for Usage Report                                                     |
| Task       | CLOUD7-269 | Refactoring - Generic Service changes for Usage Report                                             |
| Story      | CLOUD7-265 | Add Limitations in README.md                                                                       |
| Task       | CLOUD7-264 | Create a separate class for logging in DCM.                                                        |
| Story      | CLOUD7-262 | Readme of release 0.0.2                                                                            |
| Bug        | CLOUD7-251 | (Duplicate) Domain admin is able to view all the images (Horizon) when not assigned to any project |
| Bug        | CLOUD7-147 | (Duplicate)Policy JSON should allow Domain Admin to view Instances                                 |
| Bug        | CLOUD7-129 | Fix NavBar extra elements which are appearing when checking it into responsive view                |
| Task       | CLOUD7-95  | Write MFA Technical Document                                                                       |
| Task       | CLOUD7-93  | Write PCI Controls Technical Document                                                              |
| Task       | CLOUD7-60  | Write ECS Monitoring Technical Document                                                            |
| Task       | CLOUD7-54  | Usage Report Export CSV                                                                            |

## Release 0.0.2

| Issue Type | Issue Key  | Summary                                                                                                         |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| Task       | CLOUD7-53  | Usage Report Front-end                                                                                          |
| Task       | CLOUD7-54  | Usage Report Export CSV                                                                                         |
| Bug        | CLOUD7-246 | Fix Bug: Domain admin is not able to display the role assignments (Horizon)                                     |
| Task       | CLOUD7-244 | Update Usage Report Readme.md                                                                                   |
| Bug        | CLOUD7-181 | Remove Bugs from README.md in ms-usage-report                                                                   |
| Bug        | CLOUD7-154 | Subtask of CLOUD7-123 (User unable to create and delete router)                                                 |
| Task       | CLOUD7-148 | Create an authorization sheet for all roles                                                                     |
| Story      | CLOUD7-131 | Testing Scenario 1 (with CLI): policy.json applied on testing stack                                             |
| Story      | CLOUD7-174 | Update README.md in ms-middleware with deployment steps                                                         |
| Story      | CLOUD7-149 | create script to start all backend services                                                                     |
| Story      | CLOUD7-127 | Security QA (NodeJs scanners, React scanners)                                                                   |
| Bug        | CLOUD7-135 | UI and Code Bug Fix (Q4-2019-Testing DCM)                                                                       |
| Sub-task   | CLOUD7-138 | SubTask-2 of Ticket CLOUD7-135                                                                                  |
| Bug        | CLOUD7-247 | (Duplicate) Unable to display the role assignments of this user.                                                |
| Task       | CLOUD7-89  | Write Admin Portal (Version 1) Technical Document                                                               |
| Story      | CLOUD7-156 | Q/A FInal Report (Q4 2019 Testing)                                                                              |
| Task       | CLOUD7-152 | Console Log Should be Empty When use DCM                                                                        |
| Bug        | CLOUD7-182 | Subtask of CLOUD7-123 (User Instance created in ERROR state) so one cannot access other functionalities.        |
| Sub-task   | CLOUD7-143 | SubTask-3 of Ticket CLOUD7-135                                                                                  |
| Task       | CLOUD7-124 | Senario 2: policy.json removed from testing stack (3 days)                                                      |
| Sub-task   | CLOUD7-137 | SubTask-1 of Ticket CLOUD7-135                                                                                  |
| Bug        | CLOUD7-177 | Remove Bugs from README.md in ms-logger                                                                         |
| Story      | CLOUD7-133 | Update README.md in ms-usage-report                                                                             |
| Story      | CLOUD7-134 | Update README.md in ms-logger                                                                                   |
| Story      | CLOUD7-123 | Senario 3: policy.json removed from testing stack and no multi tenancy in DCM.                                  |
| Task       | CLOUD7-102 | Create a report of NodesJS best practices for existing code                                                     |
| Story      | CLOUD7-130 | Testing Scenario 1: policy.json applied on testing stack (with Horizon)                                         |
| Task       | CLOUD7-86  | Write Trilio Integration Technical Document                                                                     |
| Story      | CLOUD7-139 | add policy.json exactly in the same directory (github) as it is in the openstack and also update README.md file |
| Story      | CLOUD7-128 | Remove Tags form ms-middleware repo                                                                             |
| Story      | CLOUD7-126 | Update README.md in openstack repo                                                                              |
| Story      | CLOUD7-125 | Deploy (0.0.1)                                                                                                  |
| Story      | CLOUD7-121 | Testing Scenario 1 (with DCM): policy.json applied on testing stack                                             |
| Story      | CLOUD7-120 | Update README.md in ms-middleware                                                                               |
| Story      | CLOUD7-119 | Update README.md in ms-iam                                                                                      |
| Story      | CLOUD7-118 | Update README.md in ms-openstack                                                                                |
| Story      | CLOUD7-117 | Update README.md in web-client                                                                                  |

## Release 0.0.1

| Issue Type | Issue Key | Summary                                |
| ---------- | --------- | -------------------------------------- |
| Task       | CLOUD7-51 | Microservice - Logger                  |
| Bug        | CLOUD7-57 | Middleware Specs File - Bugs Fixing    |
| Bug        | CLOUD7-55 | Middleware Specs File - Bugs Reporting |
