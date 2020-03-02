/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
import React, {useEffect, useState, useContext} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  H3,
  Icon,
  Text, Item, Button,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {Video} from 'expo-av';
import {mediaURL} from '../constants/urlConst';
import {getUser, fetchPOST, fetchGET} from '../hooks/APIHook';
import StarRating from 'react-native-star-rating';
import FormTextInput from '../components/FormTextInput';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import CommentList from '../components/CommentList';
import {getFileComment} from '../hooks/APIHook';
import {MediaContext} from '../contexts/MediaContext';

const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
  const {navigation} = props;
  const {commentMedia, setCommentMedia} = useContext(MediaContext);
  const [owner, setOwner] = useState({});
  const [comment, setComment] = useState('');
  const [star, setStar] = useState(3);
  const [average, setAverage] = useState(3);
  const file = navigation.state.params.file;
  console.log('single40', navigation.state.params.file );

  const getOwner = async () => {
    const owner = await getUser(file.user_id);
    setOwner(owner);
  };

  const clearComment = () => {
    setComment('');
  };

  const getRating = (item) => {
    return item.rating;
  };

  const addScores = (total, rating) => {
    return total + rating;
  };

  const averageCal = async () => {
    const list = await fetchGET('ratings/file/'+ file.file_id);
    const ratingList = list.map(getRating);
    console.log('ratinglist', ratingList);
    const ratingTotal = ratingList.reduce(addScores, 0);
    console.log('ratingTotal', ratingTotal);
    const average = ratingTotal / ratingList.length;
    console.log('average', average);
    return average;
  };

  const onStarRatingPress = async (rating) => {
    setStar(rating);
    console.log('single68', rating);
    const token = await AsyncStorage.getItem('userToken');
    const data = {
      'file_id': file.file_id,
      'rating': rating,
    };
    console.log('single53', data);
    const update = await fetchPOST('ratings', data, token);
    if (!update.reason) {
      console.log('single55', update);
      const average = averageCal();
      setAverage(average);
      return update;
    } else {
      alert('Rating failed!');
    }
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
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              selectedStar={(rating) => onStarRatingPress(rating)}
              fullStarColor={'black'}
              rating={star}
            />
            <Text>{average.toString()}</Text>
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
        <Card>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={comment.toString()}
              placeholder='Comment here...'
              onChangeText={(text) => setComment(text)}
            />
            <Button
              transparent
              onPress={() => clearComment()}>
              <Icon name='backspace'/>
            </Button>
            <Button
              transparent
              onPress={ async () =>{
                const token = await AsyncStorage.getItem('userToken');
                if (comment.length) {
                  const data = {
                    'file_id': file.file_id,
                    'comment': comment,
                  };
                  const post = await fetchPOST('comments', data, token);
                  if (post.message) {
                    const data = await getFileComment(file.file_id);
                    console.log('single182', data);
                    setCommentMedia(data);
                    props.navigation.push('Single', {file: file});
                  }
                  // console.log('sngle124', post);
                  setComment('');
                  return post;
                } else {
                  alert('Comment is blank');
                }
              }}>
              <Icon name='paper-plane'/>
            </Button>
          </Item>
          <Item>
            <CommentList
              navigation = {navigation}
              file = {file.file_id}
            ></CommentList>
          </Item>
        </Card>
      </Content>
      <NavigationEvents
        onDidBlur={ () => {
          setComment('');
        }
        }
      />
    </Container>
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
