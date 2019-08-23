import React from "react";
import { Button } from 'react-native-elements'

const fetchLocation = props => {
  return <Button title="Recenter" type='solid' onPress={() => props.onGetLocation(true)} />;
};

export default fetchLocation;
