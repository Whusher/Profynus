/**
 * @file musicService.js
 * @description Music playlist API calls for Profynus.
 */

import api from '../axiosInstance';
import ENDPOINTS from '../endpoints';

const musicService = {
  
  getPublicPlaylist: ({ pageNumber = 1, pageSize = 5 } = {}) =>
    api.get(ENDPOINTS.music.publicPlaylist, {
      params: { pageNumber, pageSize },
    }),

  downloadYTSong : (urlData) => 
    api.post(ENDPOINTS.music.downloadSongYTservice, urlData),
  
};

export default musicService;