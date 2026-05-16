import React, { useEffect, useReducer, useState } from 'react';
import eyeOpenIcon from '../../../assets/eye-open-svgrepo-com.svg';
import eyeOffIcon from '../../../assets/eye-off-outline-svgrepo-com.svg';
import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const [showPassword, setShowPassword] = useState(false);

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput])

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  const isPasswordField = props.type === 'password';
  const actualType = isPasswordField && showPassword ? 'text' : props.type;

  // Criteria checks for fancy password list
  const hasLength = inputState.value.length >= 8;
  const hasUpper = /[A-Z]/.test(inputState.value);
  const hasLower = /[a-z]/.test(inputState.value);
  const hasNumber = /\d/.test(inputState.value);
  const hasSpecial = /[^a-zA-Z\d]/.test(inputState.value);

  const allCriteriaMet = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const activePlaceholder = props.showCriteria
    ? (allCriteriaMet ? "Enter password" : props.placeholder)
    : props.placeholder;

  const element =
    props.element === 'input' ? (
      <div className="input-wrapper">
        <input
          id={props.id}
          type={actualType}
          placeholder={activePlaceholder}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
        />
        {isPasswordField && (
          <button
            type="button"
            className="eye-icon"
            onClick={() => setShowPassword(prev => !prev)}
            tabIndex="-1"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <img src={eyeOffIcon} width="20" height="20" alt="Hide" /> : <img src={eyeOpenIcon} width="20" height="20" alt="Show" />}
          </button>
        )}
      </div>
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}

      {props.showCriteria && !allCriteriaMet && (
        <ul className="password-criteria">
          {!hasLength && <li className="invalid">✘ 8+ characters</li>}
          {!hasUpper && <li className="invalid">✘ 1 Uppercase letter</li>}
          {!hasLower && <li className="invalid">✘ 1 Lowercase letter</li>}
          {!hasNumber && <li className="invalid">✘ 1 Number</li>}
          {!hasSpecial && <li className="invalid">✘ 1 Special character</li>}
        </ul>
      )}

      {/* Hide standard error text if criteria list is showing */}
      {!inputState.isValid && inputState.isTouched && !(props.showCriteria && !allCriteriaMet) && (
        <p>{props.errorText}</p>
      )}
    </div>
  );
};

export default Input;
