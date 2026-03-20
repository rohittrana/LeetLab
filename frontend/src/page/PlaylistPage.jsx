import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Loader, List, Plus } from "lucide-react";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import { useNavigate } from "react-router-dom";

const PlaylistPage = () => {
  const { playlists, getAllPlaylists, isLoading, createPlaylist } =
    usePlaylistStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050a0a]">
        <Loader className="size-10 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a0a] text-[#e0ffe8] flex flex-col items-center pt-20 px-4">

      {/* PAGE WRAPPER */}
      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            My <span className="text-[#00ff88]">Playlists</span>
          </h1>

          <button
            className="flex items-center gap-2 border border-[#00ff88] px-4 py-2 text-sm uppercase tracking-wider hover:bg-[#00ff88] hover:text-black transition"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            New Playlist
          </button>
        </div>

        {/* EMPTY STATE */}
        {playlists.length === 0 ? (
          <div className="border border-[#00ff88]/30 border-dashed text-center py-10 text-sm text-gray-400">
            No playlists found. Create your first one.
          </div>
        ) : (

          /* PLAYLIST GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => navigate(`/playlists/${playlist.id}`)}
                className="
                bg-[#0b1313]
                border border-[#00ff88]/20
                p-5
                cursor-pointer
                transition
                hover:border-[#00ff88]
                hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]
                "
              >

                {/* PLAYLIST TITLE */}
                <div className="flex items-center gap-3 mb-3">
                  <List size={18} className="text-[#00ff88]" />
                  <h2 className="text-lg font-bold">
                    {playlist.name}
                  </h2>
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-400">
                  {playlist.description || "No description"}
                </p>

                {/* PROBLEM COUNT */}
                <p className="text-xs mt-4 text-[#00ff88] tracking-wider uppercase">
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