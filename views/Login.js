/* eslint-disable linebreak-style */
import React, {useState} from 'react';
import {
  Container,
  Header,
  Body,
  Title,
  Content,
  Form,
  Button,
  Text,
  Item,
  H2,
  Card,
  CardItem, View,
} from 'native-base';
import {
  AsyncStorage,
} from 'react-native';
import PropTypes from 'prop-types';
import {fetchPOST} from '../hooks/APIHook.js';
import FormTextInput from '../components/FormTextInput';
import useSignUpForm from '../hooks/LoginHook';

const Login = (props) => {
  const [toggleForm, setToggleForm] = useState(true);
  const {
    handleUsernameChange,
    handlePasswordChange,
    handleEmailChange,
    handleConfirmPasswordChange,
    validateField,
    validateOnSend,
    checkAvail,
    inputs,
    errors,
    setErrors,
  } = useSignUpForm();

  const validationProperties = {
    username: {username: inputs.username},
    email: {email: inputs.email},
    full_name: {full_name: inputs.full_name},
    password: {password: inputs.password},
    confirmPassword: {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
    },
  };

  const signInAsync = async () => {
    try {
      const user = await fetchPOST('login', inputs);
      console.log('Login', user);
      await AsyncStorage.setItem('userToken', user.token);
      await AsyncStorage.setItem('user', JSON.stringify(user.user));
      props.navigation.navigate('App');
    } catch (e) {
      console.log('signInAsync error: ' + e.message);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: e.message,
        }));
    }
  };
  const registerAsync = async () => {
    const regValid = validateOnSend(validationProperties);
    console.log('reg field errors', errors);
    if (!regValid) {
      return;
    }

    try {
      console.log('sen inputs', inputs);
      const user = inputs;
      delete user.confirmPassword;
      const result = await fetchPOST('users', user);
      console.log('register', result);
      signInAsync();
    } catch (e) {
      console.log('registerAsync error: ', e.message);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: e.message,
        }));
    }
  };


  return (
    <Container>
      <Header />
      <Content
        contentContainerStyle={{flex: 1, justifyContent: 'center'}}
        style={{padding: 20}}
      >
        {/* login form */}
        {toggleForm &&
        <Form>
          <Title>
            <H2>Login</H2>
          </Title>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.username}
              placeholder='Enter username'
              onChangeText={handleUsernameChange}
            />
          </Item>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.password}
              placeholder='Enter password'
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
            />
          </Item>
          <View style={{flexDirection: 'row',
            alignSelf: 'center', marginTop: 5}} >
            <Button rounded success
              style={{padding: 10, alignSelf: 'center'}}
              onPress={signInAsync}>
              <Text>Sign in</Text>
            </Button>
            <Button rounded light
              style={{padding: 10, alignSelf: 'center'}}
              full onPress={() => {
                setToggleForm(false);
              }}
            >
              <Text>or Register</Text>
            </Button>
          </View>
        </Form>
        }

        {/* register form */}
        {!toggleForm &&
        <Form>
          <Title>
            <H2>Register</H2>
          </Title>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.username}
              placeholder='Enter username'
              onChangeText={handleUsernameChange}
              onEndEditing={() => {
                checkAvail();
                validateField(validationProperties.username);
              }}
              error={errors.username}
            />
          </Item>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.email}
              placeholder='Enter email'
              onChangeText={handleEmailChange}
              onEndEditing={() => {
                validateField(validationProperties.email);
              }}
              error={errors.email}
            />
          </Item>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.password}
              placeholder='Enter password'
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
              onEndEditing={() => {
                validateField(validationProperties.password);
              }}
              error={errors.password}
            />
          </Item>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.confirmPassword}
              placeholder='Confirm password'
              secureTextEntry={true}
              onChangeText={handleConfirmPasswordChange}
              onEndEditing={() => {
                validateField(validationProperties.confirmPassword);
              }}
              error={errors.confirmPassword}
            />
          </Item>
          <View style={{flexDirection: 'row',
            alignSelf: 'center', marginTop: 5}} >
            <Button rounded success
              style={{padding: 10, alignSelf: 'center'}}
              onPress={registerAsync}>
              <Text>Register</Text>
            </Button>
            <Button rounded light
              style={{padding: 10, alignSelf: 'center'}}
              onPress={() => {
                setToggleForm(true);
              }}>
              <Text>or Login</Text>
            </Button>
          </View>
        </Form>
        }
        {errors.fetch &&
        <Card>
          <CardItem>
            <Body>
              <Text>{errors.fetch}</Text>
            </Body>
          </CardItem>
        </Card>
        }
      </Content>
    </Container>
  );
};

// proptypes here
Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;


/* <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.full_name}
              placeholder='fullname'
              onChangeText={handleFullnameChange}
              onEndEditing={() => {
                validateField(validationProperties.full_name);
              }}
              error={errors.full_name}
            />
          </Item> */
