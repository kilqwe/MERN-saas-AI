import React from 'react';
// 1. Import Chakra UI form components
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

type Props = {
    name: string;
    type: string;
    label: string;
}

const CustomizedInput = (props: Props) => {
    // 2. Use FormControl as a wrapper for accessibility and spacing
    return <FormControl my={4}>
        {/* 3. FormLabel handles the label styling */}
        <FormLabel htmlFor={props.name} color="white">
            {props.label}
        </FormLabel>
        {/* 4. Input receives the styling and functional props */}
        <Input
            name={props.name}
            id={props.name}
            type={props.type}
            placeholder={props.label} // Use label as placeholder for similar UX
            width="400px"
            borderRadius="10px"
            fontSize="20px"
            color="white"
            // Add focus styles for better usability
            focusBorderColor="blue.500"
        />
    </FormControl>;
};

export default CustomizedInput;