import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const CreatePage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [link, setLink] = useState('');

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const pressHandler = async event => {
    event.preventDefault();

    if (event.key === 'Enter') {
      try {
        const data = await request(
          '/api/link/generate',
          'POST',
          { from: link },
          { Authorization: `Bearer ${auth.token}`}
        );

        navigate(`/detail/${data.link._id}`);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="row">
      <div className="col s8 offset-s2">
        <form>
          <div className="input-field">
            <input
              type="text"
              id="link"
              placeholder="Paste a link"
              value={link}
              onChange={e => setLink(e.target.value)}
              onKeyPress={pressHandler}
            />
            <label htmlFor="link">Link</label>
          </div>
        </form>
      </div>
    </div>
  )
};
