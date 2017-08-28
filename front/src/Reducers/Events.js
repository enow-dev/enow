import { ADD_EVENT } from '../Constants/ActionTypes';

const initialState = {
  accepted: 0,
  address: '未取得できませんでした。',
  apiId: 0,
  created_at: '2017-08-28T02:47:20.541778945Z',
  description: '',
  endAt: '2017-08-28T02:47:20.541778815Z',
  id: 0,
  idStr: '0',
  isFavorite: false,
  lat: 0,
  limit: 0,
  lon: 0,
  place: '',
  start_at: '2017-08-28T02:47:20.541778766Z',
  title: '',
  updatedAt: '2017-08-28T02:47:20.541778983Z',
  url: '',
  waiting: 0,
};

export default function events(state = initialState, action) {
  switch (action.type) {
    case ADD_EVENT:
      return [
        {
          accepted: action.accepted,
          address: action.address,
          apiId: action.apiId,
          createdAt: action.created_at,
          description: action.description,
          endAt: action.end_at,
          id: action.id,
          idStr: action.id_str,
          isFavorite: action.is_favorite,
          lat: action.lat,
          limit: action.linit,
          lon: action.lon,
          place: action.place,
          startAt: action.start_at,
          title: action.title,
          updatedAt: action.update_at,
          url: action.url,
          waiting: action.waiting,
        },
        ...state,
      ];
    default:
      return state;
  }
}
