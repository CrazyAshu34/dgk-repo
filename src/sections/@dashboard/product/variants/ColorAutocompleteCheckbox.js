import Select from 'react-select';

const ColorSelect = ({ options, name, selectedOptions, handleSelectChange }) => {
    const getOptionLabel = option => (
        <div>
            <div style={{ backgroundColor: option.hexaColor, padding: '2px 8px', borderRadius: '4px', height: '20px', width: '20px', float: 'left', border: '1px solid lightgray' }}></div>
            <div style={{ marginLeft: '15px', paddingLeft: '20px' }}>{option.colorName}</div>
        </div>
    );

    const getOptionValue = option => option.colorName;
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '2.5px',
            // zIndex: 99999,
            // Add any other custom control styles here
        }),
        menu: (provided, state) => ({
            ...provided,
            zIndex: 11111111111, // Set a high z-index value
            position: 'relative',
        }),
        option: (provided, state) => ({
            ...provided,
            cursor: 'pointer', // Set the cursor to pointer on hover
            // zIndex: 1000,
            // Add any other custom option styles heree
        }),
    };
    return (
        <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleSelectChange}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            styles={customStyles}
            name={name}
        />
    );
};

export default ColorSelect;
