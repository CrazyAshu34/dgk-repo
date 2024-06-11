const ColorPicker = ({ hexaColorCode, onChange }) => {
    const handleColorChange = (e) => {
        const newColor = e.target.value;
        onChange(newColor);
    };

    return (
        <div>
            <input
                type="color" style={{ border: '0px', height: '56px', width: '100px', cursor: 'pointer' }}
                id="colorPicker" placeholder='fjksdfj'
                value={hexaColorCode}
                name="hexaColor"
                onChange={handleColorChange}
            />
        </div>
    );
};
export default ColorPicker;