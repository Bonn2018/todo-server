import * as regExps from '../../@core/utils/reg_exps';
import { Err } from '../../@core/errors';

export function validateSignUpBody(reqBody: Record<string, string>) {
  const userArguments = ['email', 'firstName', 'lastName', 'password'];
  
  if (!isValidRequest(reqBody, userArguments)) {
    throw new Err.ValidationError();
  }
}

export function validateSignInBody(reqBody: Record<string, string>)  {
  const userArguments = ['email', 'password'];

  if (!isValidRequest(reqBody, userArguments)) {
    throw new Err.ValidationError();
  }
}

export function isValidRequest(reqBody: Record<string, string>, payloadKeys: string[]) {
  const inputKeys = Object.keys(reqBody);
  const isAllKeysExist = JSON.stringify(payloadKeys.sort()) === JSON.stringify(inputKeys.sort());

  const isValidData = !inputKeys.some(key => {
    const isNotValid = !isValidCredential(reqBody[key], key);

    return isNotValid;
  });

  return isAllKeysExist && isValidData;
}

function isValidCredential(value: string, name: string) {
  switch(name) {
    case 'email': {
      return regExps.email.test(value);
    }
    case 'firstName':
    case 'lastName': {
      return regExps.letters.test(value);
    }
    case 'password': {
      return value.replace(/\s/g, '').length > 8
    }
    default:
      return false;
  }
}
