import React, { useCallback, useContext, useEffect, useState } from 'react';

import { AuthContext } from '../context/AuthContext';

import { useHttp } from '../hooks/http.hook';

import { Loader } from '../components/Loader';
import { LinksList } from '../components/LinksList';

export const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request(
        '/api/link',
        'GET',
        null,
        { Authorization: `Bearer ${token}` },
      );

      setLinks(fetched);
    } catch (error) {
      console.error(error);
    }
  }, [request, token]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!loading && <LinksList links={links} />}
    </>
  )
};
