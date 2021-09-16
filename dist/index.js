'use strict';

const sliders = document.querySelectorAll('.slider__range');
const sliderInputs = document.querySelectorAll('.slider__input');

/** Update CSS of input[type="range"] for Webkit browsers */
const updateInputRange = input => {
  /** Calculate value in % for input range */
  const value = ((input.value - input.min) / (input.max - input.min)) * 100;
  /** Return CSS to show the progress in Webkit only */
  return (input.style.background = `linear-gradient(to right, var(--darkest-color) 0%, var(--darkest-color) ${value}%, var(--base-grey) ${value}%, var(--base-grey) 100%)`);
};

/** Process each slider/input to update the other */
const processInput = (input, type) => {
  input.forEach(element => {
    element.oninput = function () {
      let params = {};
      if (type == 'range') {
        params = {
          selector: document.getElementById(this.getAttribute('data-input')),
          updateInput: this,
        };
      } else if (type == 'input') {
        params = {
          selector: document.querySelector(`[data-input='${this.id}']`),
          updateInput: document.querySelector(`[data-input='${this.id}']`),
        };
      }
      const selector = params.selector;
      selector.value = this.value;
      updateInputRange(params.updateInput);
    };
  });
};

/** Get the data from the form, process and print the results */
const calculateResults = () => {
  const yearsOfMortgage = document.getElementById('years').value;
  const interestRate = document.getElementById('int-rate').value;
  const loanAmount = checkValue('amount');
  const annualTax = checkValue('tax');
  const annualInsurance = checkValue('insurance');

  if (loanAmount && annualTax && annualInsurance) {
    const principleAndInterests =
      ((interestRate / 100 / 12) * loanAmount) /
      (1 - Math.pow(1 + interestRate / 100 / 12, -yearsOfMortgage * 12));
    const tax = annualTax / 12;
    const insurance = annualInsurance / 12;
    const total = principleAndInterests + tax + insurance;

    document.querySelector('.results').classList.add('results--active');
    document.querySelectorAll('.results__amount').forEach(result => {
      result.classList.add('results__amount--active');
    });
    document.getElementById('r-principal').innerHTML =
      principleAndInterests.toFixed(2);
    document.getElementById('r-tax').innerHTML = tax.toFixed(2);
    document.getElementById('r-insurance').innerHTML = insurance.toFixed(2);
    document.getElementById('r-total').innerHTML = total.toFixed(2);
  } else {
    document.querySelectorAll('.results__amount').forEach(result => {
      result.classList.remove('results__amount--active');
    });
    document.querySelectorAll('.results__value').forEach(result => {
      result.innerHTML = '- -';
    });
    document.querySelector('.results').classList.remove('results--active');
  }
};

/** Check if value is empty or not a number and add an error, otherwise returns true */
const checkValue = id => {
  const value = document.getElementById(id).value;
  if (value == '') {
    document.getElementById(id).classList.add('input--error');
    document.getElementById(`${id}-error`).innerHTML = 'Mandatory field';
    return false;
  } else if (isNaN(value)) {
    document.getElementById(id).classList.add('input--error');
    document.getElementById(`${id}-error`).innerHTML = 'Enter a number';
    return false;
  } else if (value == '0') {
    document.getElementById(id).classList.add('input--error');
    document.getElementById(`${id}-error`).innerHTML =
      'Value should be greater than zero';
  } else {
    document.getElementById(id).classList.remove('input--error');
    document.getElementById(`${id}-error`).innerHTML = '';
    return value;
  }
};

processInput(sliders, 'range');
processInput(sliderInputs, 'input');
document.querySelector('.button').addEventListener('click', e => {
  e.preventDefault();
  calculateResults();
});
