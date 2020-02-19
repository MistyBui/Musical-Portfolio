/* eslint-disable max-len */
import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MediaContext = React.createContext([{}, () => {}]);

const mediaArray = [];

const MediaProvider = (props) => {
  const [media, setMedia] = useState(mediaArray);
  const [userMedia, setUserMedia] = useState(mediaArray);

  return (
    <MediaContext.Provider value={{media, setMedia, userMedia, setUserMedia}}>
      {props.children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node,
};

export {MediaContext, MediaProvider};
