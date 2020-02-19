/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {View, Image} from 'react-native';

class AsyncImage extends Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false};
  }

  render() {
    const {
      // eslint-disable-next-line react/prop-types
      placeholderColor,
      style,
      source,
    } = this.props;

    return (
      <View
        style={style}>

        <Image
          source={source}
          resizeMode={'contain'}
          style={[
            style,
            {
              position: 'absolute',
              resizeMode: 'contain',
            },
          ]}
          onLoad={this._onLoad} />
        {!this.state.loaded &&
            <View
              style={[
                style,
                {
                  backgroundColor: placeholderColor || '#90a4ae',
                  position: 'absolute',
                },
              ]} />
        }
      </View>
    );
  }

  _onLoad = () => {
    // This only exists so the transition can be seen
    // if loaded too quickly.
    setTimeout(() => {
      // eslint-disable-next-line no-invalid-this
      this.setState(() => ({loaded: true}));
    }, 1000);
  }
}

export default AsyncImage;
