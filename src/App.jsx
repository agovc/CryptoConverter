import './App.css'
import { useState, useEffect } from 'react';

const CURRENCY_LIST = ['USD', 'EUR', 'GBP', 'CNY', 'JPY'];

export default function App() {
  return (
    <CryptoConverter />
  )
}

function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

function CryptoConverter() {

  const [conversionValue, setConversionValue] = useState({
    previous: 0,
    current: 0
  });
  const [currency, setCurrency] = useState(CURRENCY_LIST[0]);
  const [valueToConvert, setValueToConvert] = useState(0);

  const fetchConversionValue = async s => {
    const url = `https://api.frontendeval.com/fake/crypto/${s}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.value;
  }

  const handleCurrencyChange = e => {
    const value = e.target.value;
    setCurrency(value);
  }

  const handleValueToConvertChange = e => {
    const value = e.target.value;
    setValueToConvert(value);
  }

  const getConversionValue = async () => {
    const response = await fetchConversionValue(currency);
    setConversionValue({ previous: conversionValue.current, current: response });
  }

  useEffect(() => {
    getConversionValue();
  }, []);

  useEffect(() => {
    getConversionValue()
    const intervalId = setInterval(getConversionValue, 10000);
    return () => {
      clearTimeout(intervalId);
    }
  }, [currency])

  const formatPrice = number => {
    return Number.parseFloat(number).toFixed(2);
  }

  const currentValue = conversionValue.current && conversionValue.current * valueToConvert;

  const previousValue = conversionValue.previous && conversionValue.previous * valueToConvert;

  const priceChange = currentValue - previousValue;

  const hasPositiveValue = priceChange >= 0;
  const valueColor = hasPositiveValue ? 'price-increase' : 'price-decrease';
  
  return (
    <div className="widget">
      <div className="input-container">
          <input className="input-style" type="number" onChange={handleValueToConvertChange} value={valueToConvert} />
        <select className="select-style" onChange={handleCurrencyChange} name="currency" value={currency}>
          {CURRENCY_LIST.map((item, index) => {
        return (
          <option key={index} value={item}>{item}</option>
        )
          }
          )}
        </select>
      </div>

    <div className='price-container'>
      <div className="price-item">
        {formatPrice(currentValue)}
      </div>
      <div className={classNames("price-item", valueColor)}>
        {hasPositiveValue ? '⬆' : '⬇'}
      </div>
      <div className={classNames("price-item", valueColor)}>
        {formatPrice(priceChange)}
      </div>
    </div>
      
    </div>
  )
}
