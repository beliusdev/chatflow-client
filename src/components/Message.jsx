import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setMessage } from '../state';

export default function Message() {
  const dispatch = useDispatch();
  const message = useSelector(({ message }) => message);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setMessage({ success: false, text: '' }));
    }, 6000);
  }, [message]);

  return <div className="system-message">{message?.text}</div>;
}
