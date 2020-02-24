/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
import React, {useEffect, useState} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  H3,
  Icon,
  Text,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {Video} from 'expo-av';
import {mediaURL} from '../constants/urlConst';
import {getUser} from '../hooks/APIHook';
import StarRating from 'react-native-star-rating';

const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
  const {navigation} = props;
  const [owner, setOwner] = useState({});
  const file = navigation.state.params.file;

  const getOwner = async () => {
    const owner = await getUser(file.user_id);
    setOwner(owner);
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <Container>
      <Content>
        <Card>
          <CardItem>
            {file.media_type === 'image' ?
            (<AsyncImage
              style={{
                width: '100%',
                height: deviceHeight / 2,
              }}
              spinnerColor='#777'
              source={{uri: mediaURL + file.filename}}
            />)
              :
            (<Video
              source={{uri: mediaURL + file.filename}}
              rate={1.0}
              volumn={1.0}
              isMuted={false}
              resizeMode='contain'
              shouldPlay
              isLooping
              useNativeControls
              style={{width: '100%', height: deviceHeight/2}}
            />)
            }
          </CardItem>
          <CardItem>
            <StarRating
              disabled={false}
              maxStars={5}
              defaultRating={3}
            />
          </CardItem>
          <CardItem>
            <Left>
              <Icon name='image'/>
              <Body>
                <H3>{file.title}</H3>
                <Text>{file.description}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Left>
              <Icon name='person' />
              <Body>
                <Text>By {owner.username} ({owner.email})</Text>
                {owner.full_name &&
                  <Text>{owner.full_name}</Text>
                }
              </Body>
            </Left>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
