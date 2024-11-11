import { toASCII } from 'punycode';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const isValidPort = (port: string) => {
  const MIN_PORT = 1;
  const MAX_PORT = 65535;
  const parsedPort = parseInt(port, 10);

  return !isNaN(parsedPort) && parsedPort >= MIN_PORT && parsedPort <= MAX_PORT;
};

const errorMessages = {
  fieldIsRequired: 'This field is required',
  invalidFormat: 'Invalid data format',
  loginUrl: 'Invalid login url format',
  numberTooSmall: 'The number is too small! Minimum: {0}',
  numberTooBig: 'The number is too big! Maximum: {0}',
  invalidNumber: 'Invalid number',
  invalidInteger: 'The value is not an integer',
  invalidDouble: 'The value is not a double',
  invalidDomainMinLength: 'Name should be at least {0} characters long',
  invalidExtension: 'We do not support this domain extension',
  invalidDomainMaxLength: 'Domain name has more than {0} characters',
  invalidTldMaxLength: 'Domain extension has more than 24 characters',
  domainWithSpecialChars: 'Domains with special characters are not allowed',
  textTooSmall: 'The length of text is too small! Current: {0}, Minimum: {1}',
  textTooBig: 'The length of text is too big! Current: {0}, Maximum: {1}',
  thisNotText: 'This is not a text!',
  invalidAdress: 'Address contains invalid special character',
  nameTooShort:
    '{0} is too short. Please enter a name of at least 2 characters.',
  onlyName: 'Please do not use special characters or numbers',
  userNameAndSurnameNotMeetRequirements:
    "Please ensure your name is between 2 and 64 characters long and doesn't include any numbers or special characters",
  thisNotArray: 'This is not an array!',

  selectMinItems: 'Select minimum {0} items!',
  selectMaxItems: 'Select maximum {0} items!',

  invalidDate: 'Invalid date or date format YYYY-MM-DD',
  dateIsEarly: 'The date is too early! Current: {0}, Minimum: {1}',
  dateIsLate: 'The date is too late! Current: {0}, Maximum: {1}',

  invalidIPv4: 'Value must be valid IPv4 address',
  invalidIPv6: 'Value must be valid IPv6 address',
  invalidIPRange: 'Value must be valid IP/IP range',
  invalidNameserver: 'Invalid nameserver structure',

  invalidEmail: 'Invalid email address',
  emailTooLong: 'An email address is too long.',
  invalidURL: 'Invalid URL!',
  invalidMailServer: 'Invalid mail server structure',

  invalidCard: 'Invalid card format!',
  invalidCardNumber: 'Invalid card number!',

  invalidPort: 'Invalid port or port range',

  invalidTextContainNumber:
    'Invalid text! Cannot contains numbers or special characters',
  invalidTextContainSpec: 'Invalid text! Cannot contains special characters',
  noStringSpaceAllowed: 'Invalid text! Cannot contain whitespace',
  noHostingersDomains:
    "It looks like you're trying to migrate a website from Hostinger. Please enter information from a different hosting provider.",
  invalidCPanelUsername:
    'Special characters are not supported in the username field',
  noBuilderDomains:
    "We're unable to migrate websites made with custom website builder",
  invalidDomainStructure: 'Invalid domain structure',
  domainNotRegistered: 'Domain is not registered',
  invalidHostnameStructure: 'Invalid hostname structure',
  invalidDomainName: 'Invalid domain name',
  notSupportedTld: 'We do not support this domain extension',
  isMoreThanOneDomain: 'This field cannot contain more than one domain',
  notJustValidDomain: 'Must contain one valid domain',
  passwordLength: `Password must have at least {0} symbols`,
  passwordTooEasy:
    'Your password must be at least 8 characters long and contain at least one number, one uppercase letter, and one lowercase letter',
  emailPasswordTooEasy:
    'Password must contain at least one number, one uppercase, and lowercase letters. The length should be between 8 and 50 characters.',
  passwordNoCapital: 'Password must contain capital letters',
  passwordNoNumber: 'Password must contain numbers',
  passwordsNotMatching: 'Passwords do not match',
  passwordNotMeetRequirements: 'Password does not meet the requirements',
  passwordNoSpaces: 'Password cannot contain whitespace',

  invalidSshFormat: 'Invalid SSH key format!',
  invalidIP: 'Value must be valid IPv4 or IPv6 address',

  twoFactorCodeTooShort: 'Authentication code is too short',
  twoFactorCodeTooLong: 'Authentication code is too long',

  nameserverTooLong: 'Nameserver name too long! Maximum length 255',

  subdirectoryInvalid:
    "Subdirectory name can't contain any special characters or spaces",
  minKeywords: 'Minimum {0} keywords required',
  maxKeywords: 'Maximum {0} keywords allowed',
  allowedSymbols: 'Only {0} symbols allowed',
  numberIsNotInRange: '{0} must be between {1} and {2}',
  indiaCity: 'v2.form.validation.indiaCity',
  indiaAddress: 'v2.form.validation.indiaAddress',
  indiaZip: 'v2.form.validation.indiaZip',
};

const formatMessage = (text: string, params?: any[]) =>
  params ? { text, params } : { text };

const validators = {
  required(value: string) {
    if (!value || !value.replace(/^\s+|\s+$/, '').length) {
      return formatMessage(errorMessages.fieldIsRequired);
    }

    return null;
  },

  max(value: string, validationValue: number) {
    if (value.length > validationValue) {
      return formatMessage(errorMessages.textTooBig, [
        value.length,
        validationValue,
      ]);
    }
  },

  min(value: string, validationValue: number) {
    if (value.length < validationValue) {
      return formatMessage(errorMessages.textTooSmall, [
        String(value.length),
        String(validationValue),
      ]);
    }
  },

  address(value: string) {
    if (!value) return;
    const re = /^[a-zA-Z0-9\s,.'#-]{3,}$/;
    if (!re.test(value)) {
      return formatMessage(errorMessages.invalidAdress);
    }
  },

  number(value: string) {
    const number = +value;
    if (isNaN(number)) {
      return formatMessage(errorMessages.invalidNumber);
    }
  },

  isValidPortRange(value: string) {
    const [start, end] = value.trim().split(':');

    const isFirstPortValid = isValidPort(start);
    const isSecondPortValid = isValidPort(end);

    if (isFirstPortValid && isSecondPortValid) {
      const startNumber = parseInt(start, 10);
      const endNumber = parseInt(end, 10);
      const isRangeValid = startNumber < endNumber;

      if (!isRangeValid) {
        return formatMessage(errorMessages.invalidPort);
      }

      return;
    }

    return formatMessage(errorMessages.invalidPort);
  },

  port(value: string) {
    const validValues = /^[0-9:]+$/;
    const isValidValues = validValues.test(value);

    if (!isValidValues) {
      return formatMessage(errorMessages.invalidPort);
    }

    if (value.includes(':')) {
      return this.isValidPortRange(value);
    }

    if (!isValidPort(value)) {
      return formatMessage(errorMessages.invalidPort);
    }
  },

  alpha(value: string) {
    const re = /^([^0-9]*)$/;
    if (!re.test(value)) {
      return formatMessage(errorMessages.thisNotText);
    }
  },

  regex(value: string, validationValue: string) {
    const re = new RegExp(validationValue);
    if (!re.test(value)) {
      return formatMessage(errorMessages.invalidFormat);
    }
  },

  email(value: string) {
    const [localPart] = value.split('@');

    if (localPart.length > 64 || value.length > 255) {
      return formatMessage(errorMessages.emailTooLong);
    }

    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
    if (!re.test(value)) {
      return formatMessage(errorMessages.invalidEmail);
    }
  },

  url(value: string) {
    const [protocol, urlWithoutProtocol] = value.split('://');
    const urlEncoded = toASCII(urlWithoutProtocol || '');
    const urlToValidate = (protocol ? `${protocol}://` : '') + urlEncoded;

    const re =
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,15}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

    if (!re.test(urlToValidate)) {
      return formatMessage(errorMessages.invalidURL);
    }
  },

  password(value: string) {
    // Complexity
    if (!value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)) {
      return formatMessage(errorMessages.passwordTooEasy);
    }
  },
  /**
   * Validates password complexity by following rules:
   * - Between 8 and 50 characters
   * - No non-ASCII characters
   */
  simplePassword(value: string) {
    if (!value.match(/^[\x00-\x7Fa-zA-Z]{8,50}$/)) {
      return formatMessage(errorMessages.passwordNotMeetRequirements);
    }
  },

  date(value: string, validators: { min: string; max: string }) {
    const dateFormat = 'YYYY-MM-DD';
    const valid = dayjs(value, dateFormat, true).isValid();
    const formattedDate = dayjs(value, dateFormat);

    if (!valid) {
      return formatMessage(errorMessages.invalidDate);
    }

    if (
      validators.min &&
      dayjs(formattedDate).isBefore(dayjs(validators.min, dateFormat), 'day')
    ) {
      return formatMessage(errorMessages.dateIsEarly, [
        formattedDate.format(dateFormat),
        dayjs(validators.min, dateFormat).format(dateFormat),
      ]);
    }

    if (
      validators.max &&
      dayjs(validators.max, dateFormat).isBefore(formattedDate, 'day')
    ) {
      return formatMessage(errorMessages.dateIsLate, [
        formattedDate.format(dateFormat),
        dayjs(validators.max, dateFormat).format(dateFormat),
      ]);
    }
  },

  directory(value: string) {
    const re = /^[a-zA-Z0-9]*$/;
    if (value.includes(' ') || !re.test(value)) {
      return formatMessage(errorMessages.subdirectoryInvalid);
    }
  },

  allowedSymbols(value: string, validationValue: string) {
    const regex = new RegExp(
      `^(?=.*[${validationValue}])[A-Za-z0-9${validationValue}]+$`,
    );

    if (!regex.test(value)) {
      return formatMessage(errorMessages.allowedSymbols, [validationValue]);
    }
  },
};

export default validators;
