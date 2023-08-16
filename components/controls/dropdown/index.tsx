import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { View } from "react-native";
import themeStyle from "../../../styles/theme.style";

export type TProps = {
  itemsList: any;
  defaultValue: any;
  placeholder?: any;
  dropDownDirection?: any;
  onChangeFn: (value: any) => void;
  onToggle?: (value: any) => void;
};
const DropDown = ({
  itemsList,
  defaultValue,
  onChangeFn,
  placeholder,
  onToggle,
  dropDownDirection = "DOWN",
}: TProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [items, setItems] = useState(itemsList);

  useEffect(() => {
    onToggle && onToggle(open);
  }, [open]);
  const onSetValue = (value: any) => {
    setValue(value);
  };

  useEffect(() => {
    onChangeFn(value);
  }, [value]);

  useEffect(()=>{
    setValue(defaultValue)
  },[defaultValue])

  return (
    <View style={{ flexDirection: "row" }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={onSetValue}
        setItems={setItems}
        placeholderStyle={{
          textAlign: "left",
          color: themeStyle.WHITE_COLOR,
        }}
        labelStyle={{
          textAlign: "left",
          color: themeStyle.WHITE_COLOR,
        }}
        style={{
          flexDirection: "row",
          borderColor: themeStyle.SUCCESS_COLOR,
          backgroundColor: themeStyle.SUCCESS_COLOR,
          borderRadius: 30,
          minHeight:30,
        }}
        listItemLabelStyle={{
          textAlign: "left",
          color: themeStyle.TEXT_PRIMARY_COLOR,
        }}
        dropDownContainerStyle={{
          borderColor: themeStyle.PRIMARY_COLOR,
          backgroundColor: "rgba(254, 254, 254, 1)",
          maxHeight: "auto",
        }}
        itemSeparatorStyle={{ backgroundColor: themeStyle.PRIMARY_COLOR }}
        arrowIconStyle={{
          tintColor: themeStyle.PRIMARY_COLOR
        }}
        ListModeType={"FLAT"}
        dropDownDirection={dropDownDirection}
        placeholder={placeholder}
        itemSeparator
        modalAnimationType={"slide"}
        // containerStyle={{}}
        // childrenContainerStyle={{
        //   justifyContent: 'flex-end',
        // }}
        // itemStyle={{justifyContent: 'flex-end', left:100}}
        // dropDownStyle={{backgroundColor: '#fafafa', height: 100}}
      />
    </View>
  );
};
export default DropDown;
