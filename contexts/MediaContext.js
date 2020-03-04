/* eslint-disable max-len */
import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MediaContext = React.createContext([{}, () => {}]);

const mediaArray = [];

const MediaProvider = (props) => {
  const [media, setMedia] = useState(mediaArray);
  const [searchMedia, setSearchMedia] = useState(mediaArray);
  const [commentMedia, setCommentMedia] = useState(mediaArray);
  const [favMedia, setFavMedia] = useState(mediaArray);
  return (
    <MediaContext.Provider value={{media, setMedia,
      searchMedia, setSearchMedia, commentMedia, setCommentMedia,
      favMedia, setFavMedia}}>
      {props.children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node,
};

export {MediaContext, MediaProvider};
