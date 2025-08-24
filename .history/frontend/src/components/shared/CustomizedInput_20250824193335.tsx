import React from 'react';
import { Input } from '@chakra-ui/react';

type Props = {
    name: string;
    type: string;
    label: string;
}

const CustomizedInput = (props: Props) => {
    // This component should only return the styled Input
    return <Input
        name={props.name}
        id={props.name}
        type={props.type}
        placeholder={props.label}
        width="100%"
        borderRadius="lg"
        fontSize="md"
        color="white"
        bg="rgba(255, 255, 255, 0.05)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
        focusBorderColor="blue.500"
        _placeholder={{ color: "gray.400" }}
    />;
};

export default CustomizedInput;