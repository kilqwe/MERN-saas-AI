import React from 'react';
import { Input } from '@chakra-ui/react';

type Props = {
    name: string;
    type: string;
    label: string;
}

const CustomizedInput = (props: Props) => {
    return <Input
        name={props.name}
        id={props.name}
        type={props.type}
        placeholder={props.label}
        width="100%"
        borderRadius="lg"
        fontSize="md"
        color="white"
        // ✅ Switched to a darker background to match the duller theme
        bg="rgba(0, 0, 0, 0.14)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.15)"
        focusBorderColor="rgba(74, 144, 226, 0.7)"
        _placeholder={{ color: "gray.400" }}
        _hover={{ borderColor: "rgba(255, 255, 255, 0.25)" }}
    />;
};

export default CustomizedInput;