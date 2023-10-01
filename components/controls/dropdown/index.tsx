import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import themeStyle from "../../../styles/theme.style";
import { getCurrentLang } from "../../../translations/i18n";
import { useTranslation } from "react-i18next";
import Icon from "../../icon";
import { TouchableOpacity } from "react-native-gesture-handler";

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
  const { t } = useTranslation();

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

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleAnswer = (value)=>{
    onSetValue(value);
    setOpen(false)
  }

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
          textAlign: "center",
          color: themeStyle.WHITE_COLOR,
        }}
        labelStyle={{
          textAlign: "center",
          color: themeStyle.WHITE_COLOR,
          fontSize: 26,
          fontFamily: `${getCurrentLang()}-SemiBold`,
        }}
        style={{
          flexDirection: "row",
          borderColor: themeStyle.SUCCESS_COLOR,
          backgroundColor: themeStyle.SUCCESS_COLOR,
          borderRadius: 0,
          minHeight: 36,
        }}
        listItemLabelStyle={{
          textAlign: "center",
          color: themeStyle.GRAY_700,
          fontSize: 18,
          maxWidth: "93%",
          fontFamily: `${getCurrentLang()}-SemiBold`,
        }}
        dropDownContainerStyle={{
          borderColor: themeStyle.PRIMARY_COLOR,
          backgroundColor: "rgba(254, 254, 254, 1)",
          maxHeight: "auto",
        }}
        itemSeparatorStyle={{ backgroundColor: themeStyle.PRIMARY_COLOR }}
        arrowIconStyle={{
          tintColor: themeStyle.PRIMARY_COLOR,
        }}
        ListModeType={"FLAT"}
        dropDownDirection={dropDownDirection}
        placeholder={placeholder}
        itemSeparator
        modalAnimationType={"slide"}
        renderListItem={(itemProps) => {
          return (
            <TouchableOpacity
              style={{
                alignItems: "center",
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "center",
                marginLeft: -30,
              }}
              onPress={()=>handleAnswer(itemProps.value)}
            >
              <Icon icon="store-icon" size={30} color={"#000000"} />
              <Text style={{ fontSize: 18, marginLeft: 5,color: themeStyle.GRAY_700,fontFamily: `${getCurrentLang()}-SemiBold`, }}>
                {itemProps.value == "1" ? t("tira") : t("tibe")} 
              </Text>
            </TouchableOpacity>
          );
        }}
        multipleText="%d categories have been selected."

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
