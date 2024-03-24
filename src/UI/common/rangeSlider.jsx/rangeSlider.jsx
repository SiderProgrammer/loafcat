import React from "react";

export const RangeSlider = ({ min, max, value, step, onChange }) => {
    const [minValue, setMinValue] = React.useState(value ? value.min : min);
    const [maxValue, setMaxValue] = React.useState(value ? value.max : max);
  
    React.useEffect(() => {
      if (value) {
        setMinValue(value.min);
        setMaxValue(value.max);
      }
    }, [value]);
  
    const handleMinChange = e => {
      e.preventDefault();
      const newMinVal = +e.target.value
     
     if (!value) setMinValue(newMinVal);
        onChange({ min: newMinVal, max: maxValue });
    };
  
   
  
    const minPos = ((minValue - min) / (max - min)) * 100;
    const maxPos = ((maxValue - min) / (max - min)) * 100;

    return (
      <div class="wrapper">
        <div class="input-wrapper">
          <input
            class="inputSlider"
            type="range"
            value={minValue}
            min={min}
            max={max}
            step={step}
            onChange={handleMinChange}
          />
     
        </div>
  
        <div class="control-wrapper">
          <div class="control" style={{ left: `${minPos}%` }} />
          <div class="rail">
            <div
              class="inner-rail" 
              style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
            />
          </div>
          <div class="control" style={{ left: `${maxPos}%` }} />
        </div>
      </div>
    );
  };