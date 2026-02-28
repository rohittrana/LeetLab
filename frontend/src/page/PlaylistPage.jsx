import React, { useEffect, useState } from 'react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { Loader, List } from 'lucide-react';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import { useNavigate } from 'react-router-dom';

const PlaylistPage = () => {
  const { playlists, getAllPlaylists, isLoading, createPlaylist } = usePlaylistStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold">
            My <span className="text-primary">Playlists</span>
          </h1>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + New Playlist
          </button>
        </div>

        {playlists.length === 0 ? (
          <p className="text-center text-lg text-gray-500 border border-primary px-4 py-2 rounded-md border-dashed">
            No playlists found. Create one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="card bg-base-200 shadow-md p-4 cursor-pointer hover:border hover:border-primary transition"
                onClick={() => navigate(`/playlists/${playlist.id}`)}  // 👈
              >
                <div className="flex items-center gap-3 mb-2">
                  <List className="text-primary" />
                  <h2 className="text-xl font-bold">{playlist.name}</h2>
                </div>
                <p className="text-gray-500 text-sm">{playlist.description || 'No description'}</p>
                <p className="text-sm mt-2 text-primary font-semibold">
                  {playlist.problems?.length || 0} Problems
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createPlaylist}
      />
    </div>
  );
};

export default PlaylistPage;