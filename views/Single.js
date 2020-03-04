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
  Header, Right,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {Video} from 'expo-av';
import {mediaURL} from '../constants/urlConst';
import {getUser, fetchPOST, fetchGET, fetchDELETE,
  getFileLike, getCurrentUser, getAllFav} from '../hooks/APIHook';
import StarRating from 'react-native-star-rating';
import FormTextInput from '../components/FormTextInput';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import CommentList from '../components/CommentList';
import {getFileComment} from '../hooks/APIHook';
import {MediaContext} from '../contexts/MediaContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
  const {navigation} = props;
  const {commentMedia, setCommentMedia} = useContext(MediaContext);
  const {favMedia, setFavMedia} = useContext(MediaContext);
  const [owner, setOwner] = useState({});
  const [comment, setComment] = useState('');
  const [star, setStar] = useState(0);
  const [average, setAverage] = useState(0);
  const [like, setLike] = useState(false);
  const file = navigation.state.params.file;


  const getOwner = async () => {
    const owner = await getUser(file.user_id);
    setOwner(owner);
    averageCal();
    getLike();
  };

  // clear comment input
  const clearComment = () => {
    setComment('');
  };

  // return rating of each object
  const getRating = (item) => {
    return item.rating;
  };

  // return id of each object
  const getId = (item) => {
    return item.user_id;
  };

  // calculate sum
  const addScores = (total, rating) => {
    return total + rating;
  };

  // calculate average
  const averageCal = async () => {
    const list = await fetchGET('ratings/file/'+ file.file_id);
    const ratingList = list.map(getRating);
    console.log('ratinglist', ratingList);
    const ratingTotal = ratingList.reduce(addScores, 0);
    console.log('ratingTotal', ratingTotal);
    const average = (ratingTotal / ratingList.length).toFixed(1);
    setAverage(average);
    console.log('average', average);
    return average;
  };

  // after rating, calculate average and show new number
  const onStarRatingPress = async (rating) => {
    // get rating for a file
    const list = await fetchGET('ratings/file/'+ file.file_id);
    // get array of only user id
    const userList = list.map(getId);
    const user = await getCurrentUser();
    // if current user already rating, then not allowed to rate
    if (!userList.includes(user.user_id)) {
      console.log('rating', user.user_id);
      console.log('getlike115map', userList);
      setStar(rating);
      console.log('single68', rating);
      const token = await AsyncStorage.getItem('userToken');
      const data = {
        'file_id': file.file_id,
        'rating': rating,
      };
      console.log('single53', data);
      const update = await fetchPOST('ratings', data, token);
      // if post succeed, calculate average
      if (!update.reason) {
        console.log('single55', update);
        averageCal();
      } else {
        alert('Rating failed!');
      }
    } else {
      alert('You have rated already!');
    }
  };

  // add like when pressing heart button, button turns red
  const postLike = async (id) => {
    const token = await AsyncStorage.getItem('userToken');
    const like = await fetchPOST('favourites/', id, token);
    setLike(true);
    const data = getAllFav();
    setFavMedia(data);
    console.log('postlike', like);
    return like;
  };

  // delete like when pressing heart button, button turns gray
  const deleteLike = async (id) => {
    const token = await AsyncStorage.getItem('userToken');
    const result = await fetchDELETE('favourites/file', id, token);
    setLike(false);
    const data = getAllFav();
    setFavMedia(data);
    console.log('apidel', result);
    return result;
  };

  // get like list of a file
  const getLike = async () => {
    const list = await getFileLike(file.file_id);
    console.log(list);
    const user = await getCurrentUser();
    console.log('ownerid', user.user_id);
    const userList = list.map(getId);
    console.log('getlike115map', userList);
    // like-unlike function
    if (userList.includes(user.user_id)) {
      setLike(true);
    } else {
      setLike(false);
      console.log('getlike125', like);
    }
  };

  // merge two array
  const mergeArrayObjects = (arr1, arr2) =>{
    return arr1.map((item, i)=>{
      if (item.user_id === arr2[i].user_id) {
        // merging two objects
        return Object.assign({}, item, arr2[i]);
      }
    });
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <KeyboardAwareScrollView>
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
            <Left>
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
              <Text style={{fontSize: 50}}>{average > 0 ? average : 0} /5</Text>
            </Left>
            <Right>
              <Button transparent
                onPress={() =>{
                  {!like ? postLike({file_id: file.file_id})
                  : deleteLike(file.file_id);}
                }}>
                <Icon name='heart'
                  style={{fontSize: 40, color: [like ? 'red' : 'gray']}}></Icon>
              </Button>
            </Right>
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
          <CardItem>
            <Left>
              <Icon name='image'/>
              <Body>
                <H3>{file.title}</H3>
                <Text>{file.description}</Text>
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
                    const token = await AsyncStorage.getItem('userToken');
                    const userList = await Promise.all(data.map((item) => {
                      return fetchGET('users', item.user_id, token);
                    }));
                    console.log('cmtlist', userList);
                    const newList = mergeArrayObjects(data, userList);
                    setCommentMedia(newList.reverse());
                    // props.navigation.push('Single', {file: file});
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
    </KeyboardAwareScrollView>
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
