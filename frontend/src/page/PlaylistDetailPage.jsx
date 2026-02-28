import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { Loader, ArrowLeft } from 'lucide-react';

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlaylistDetails, currentPlaylist, isLoading } = usePlaylistStore(); // ✅ fixed name

  useEffect(() => {
    getPlaylistDetails(id); // ✅ fixed name
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <div className="w-full max-w-4xl">
        <button
          className="btn btn-ghost mb-6"
          onClick={() => navigate('/playlists')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Playlists
        </button>

        <h1 className="text-4xl font-extrabold mb-2">
          {currentPlaylist?.name}
        </h1>
        <p className="text-gray-500 mb-8">{currentPlaylist?.description}</p>

        {currentPlaylist?.problems?.length === 0 ? (
          <p className="text-center text-lg text-gray-500 border border-primary px-4 py-2 rounded-md border-dashed">
            No problems in this playlist yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {currentPlaylist?.problems?.map(({ problem }) => (
              <div
                key={problem.id}
                className="flex items-center justify-between bg-base-200 p-4 rounded-lg cursor-pointer hover:border hover:border-primary transition"
                onClick={() => navigate(`/problem/${problem.id}`)}
              >
                <span className="font-semibold">{problem.title}</span>
                <span className={`badge ${
                  problem.difficulty === 'EASY' ? 'badge-success' :
                  problem.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-error'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;