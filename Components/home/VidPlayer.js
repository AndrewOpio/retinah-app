import React, { Component } from 'react';
//Import React
import { Platform, StyleSheet, Text, View } from 'react-native';
//Import Basic React Native Component
import VideoPlayer from 'react-native-video-controls';
//Import React Native Video to play video
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
//Media Controls to control Play/Pause/Seek and full screen
import Lightbox from 'react-native-lightbox';

export default class VidPlayer extends Component {
  videoPlayer;

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: true,
      playerState: PLAYER_STATES.PAUSED,
      screenType: 'content',
    };
  }

  onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };

  onPaused = playerState => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };

  onReplay = () => {
    //Handler for Replay
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer.seek(0);
  };

  onProgress = data => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };
  
  onLoad = data => this.setState({ duration: data.duration, isLoading: false, paused :true });
  
  onLoadStart = data => this.setState({ isLoading: true });
  
  //onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED, paused : true });
  
  onError = () => alert('Oh! ', error);

  onPlay = () =>{
    this.setState({paused : false});
  }

  //Pausing video when it ends
  onEnd = () => {
    this.setState({paused : true});
  }

  onPause = () => {
    this.setState({paused : true});
  }

  exitFullScreen = () => {
    alert('Exit full screen');
  };
  
  enterFullScreen = () => {};
  
  onFullScreen = () => {
    if (this.state.screenType == 'content')
      this.setState({ screenType: 'cover' });
    else this.setState({ screenType: 'content' });
  };

  renderToolbar = () => (
    <View>
      <Text> toolbar </Text>
    </View>
  );
  
  onSeeking = currentTime => this.setState({ currentTime });

  render() {
    return (
      <View style={styles.container}>
        <VideoPlayer
         resizeMode="cover"
          onEnd={this.onEnd}
         // onPause = {this.onPause}
         // onPlay = {this.onPlay}
         // onLoad={this.onLoad}
         // onLoadStart={this.onLoadStart}
          //onProgress={this.onProgress}
          paused={this.state.paused}
          repeat = {true}
          ref={videoPlayer => (this.videoPlayer = videoPlayer)}
          onFullScreen={this.state.isFullScreen}
          source={{uri : this.props.video}}
          style={styles.videoStyle}
          volume={10}
        />
        
        </View>      
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginBottom : 10
  },
   videoActive: {
    flex: 1,
    resizeMode: 'contain',
  },

  videoStyle: {
    width: null,
    height: 250,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'contain',
  },

  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 13,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});














































