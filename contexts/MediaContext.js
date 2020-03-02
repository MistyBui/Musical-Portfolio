/* eslint-disable max-len */
import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MediaContext = React.createContext([{}, () => {}]);

const mediaArray = [];

const MediaProvider = (props) => {
  const [media, setMedia] = useState(mediaArray);
  const [searchMedia, setSearchMedia] = useState(mediaArray);
  const [commentMedia, setCommentMedia] = useState(mediaArray);

  return (
    <MediaContext.Provider value={{media, setMedia,
      searchMedia, setSearchMedia, commentMedia, setCommentMedia}}>
      {props.children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node,
};

export {MediaContext, MediaProvider};
