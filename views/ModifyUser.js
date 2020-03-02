/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import React, {useEffect, useState, useContext} from 'react';
import {
  Content,
  Form,
  CardItem,
  Spinner,
  Button,
  Text,
} from 'native-base';
import useSignUpForm from '../hooks/LoginHook';
import FormTextInput from '../components/FormTextInput';
import PropTypes from 'prop-types';
import {validateField} from '../utils/validation';
import {modifyConstraints} from '../constants/validationConst';
import {fetchPUT, getCurrentUser} from '../hooks/APIHook';
import {AsyncStorage} from 'react-native';


const ModifyUser = (props) => {
  const [send, setSend] = useState(false);
  const {
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleEmailChange,
    inputs,
    errors,
    setErrors,
    setInputs,
    loading,
  } = useSignUpForm();

  const validationProperties = {
    email: {email: inputs.email},
    password: {password: inputs.password},
    confirmPassword: {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
    },
  };

  const validate = (field, value) => {
    console.log('vp', validationProperties[field]);
    setErrors((errors) =>
      ({
        ...errors,
        [field]: validateField(validationProperties[field],
            modifyConstraints),
        fetch: undefined,
      }));
  };

  const handleEmail = (text) => {
    handleEmailChange(text);
    validate('email', text);
  };

  const handlePassword = (text) => {
    handlePasswordChange(text);
    // validate('password', text);
  };

  const handleConfirmPassword = (text) => {
    console.log('modify64', text);
    handleConfirmPasswordChange(text);
    // validate('confirmPassword', text);
  };

  const checkErrors = () => {
    console.log('errors', errors);
    if (errors.email !== undefined ||
      errors.password !== undefined ||
      errors.confirmPassword !== undefined) {
      setSend(false);
    } else {
      setSend(true);
    }
  };

  const save = async (input) => {
    const token = await AsyncStorage.getItem('userToken');
    const update = await fetchPUT('users',
        input, token);
    if (update.message == 'User data updated') {
      alert('Succedded. Login again to see changes');
    } else {
      alert('Update fail. Contact admin.');
    }
    return update;
  };

  const reset = () => {
    setErrors({});
    setInputs({});
  };

  useEffect(() => {
    checkErrors();
  }, [errors]);

  console.log('send', send);
  console.log('inputs', inputs);
  return (
    <Content>
      {loading ? (
        <Spinner />
      ) : (
          <Form
            contentContainerStyle={{flex: 1, justifyContent: 'center'}}
            style={{padding: 20}}>
            <CardItem>
              <FormTextInput
                autoCapitalize='none'
                placeholder='New email'
                onChangeText={handleEmail}
                value={inputs.email}
                error={errors.email}
              />
              <Button rounded light
                onPress={() => {
                  if (!inputs.email) {
                    alert('Enter new email.');
                  }
                  save(inputs);
                }}>
                <Text>Save</Text>
              </Button>
            </CardItem>
            <CardItem>
              <FormTextInput
                autoCapitalize='none'
                placeholder='New password'
                onChangeText={handlePassword}
                onEndEditing={(e) => {
                  validate('password',
                      e.nativeEvent.text);
                }}
                value={inputs.password}
                error={errors.password}
                secureTextEntry={true}
              />
            </CardItem>
            <CardItem>
              <FormTextInput
                autoCapitalize='none'
                placeholder='Retype password'
                onChangeText={handleConfirmPassword}
                onEndEditing={(e) => {
                  validate('confirmPassword',
                      e.nativeEvent.text);
                }}
                value={inputs.confirmPassword}
                error={errors.confirmPassword}
                secureTextEntry={true}
              />
              <Button rounded light
                onPress={() => {
                  if (!inputs.password || !inputs.confirmPassword) {
                    alert('Enter new password or confirm password.');
                  }
                  const newInput = {'password': inputs.password};
                  console.log('modify163', newInput);
                  save(newInput);
                }}>
                <Text>Save</Text>
              </Button>
            </CardItem>
            <Button full danger
              style={{padding: 10, alignSelf: 'center', borderRadius: 50}}
              onPress={() => reset()}>
              <Text>Reset</Text>
            </Button>
          </Form>
        )}
    </Content>
  );
};

ModifyUser.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyUser;
