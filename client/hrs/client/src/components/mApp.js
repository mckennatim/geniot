import React from 'react';
import {Gmaps} from 'react-gmaps';

const coords = {
  lat: 42.3150166 ,
  lng: -71.11114839999999
};
 
export const Mapp = React.createClass({
  render() {
    return (
      <Gmaps
        width={'300px'}
        height={'400px'}
        lat={coords.lat}
        lng={coords.lng}
        zoom={14}
        loadingMessage={'Be happy'}
        params={{v: '3.exp'}}
        >
      </Gmaps>
    );
  }
});