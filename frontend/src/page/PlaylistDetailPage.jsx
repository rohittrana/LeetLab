import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Loader, ArrowLeft } from "lucide-react";

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getPlaylistDetails, currentPlaylist, isLoading } = usePlaylistStore();

  useEffect(() => {
    getPlaylistDetails(id);
  }, [id, getPlaylistDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050a0a]">
        <Loader className="size-10 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a0a] text-[#e0ffe8] flex flex-col items-center pt-20 px-4">

      <div className="w-full max-w-4xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/playlists")}
          className="
          flex items-center gap-2
          border border-[#00ff88]/30
          px-4 py-2
          text-sm
          hover:border-[#00ff88]
          hover:bg-[#00ff88]/10
          transition
          mb-8
          "
        >
          <ArrowLeft size={16} />
          Back to Playlists
        </button>

        {/* PLAYLIST TITLE */}
        <h1 className="text-4xl font-extrabold mb-2">
          {currentPlaylist?.name}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-400 mb-10">
          {currentPlaylist?.description}
        </p>

        {/* EMPTY STATE */}
        {currentPlaylist?.problems?.length === 0 ? (
          <div className="
            border border-[#00ff88]/30
            border-dashed
            text-center
            py-8
            text-gray-400
          ">
            No problems in this playlist yet.
          </div>
        ) : (

          /* PROBLEM LIST */
          <div className="flex flex-col gap-4">

            {currentPlaylist?.problems?.map(({ problem }) => {

              const difficultyColor =
                problem.difficulty === "EASY"
                  ? "text-green-400 border-green-400/30"
                  : problem.difficulty === "MEDIUM"
                  ? "text-yellow-400 border-yellow-400/30"
                  : "text-red-400 border-red-400/30";

              return (
                <div
                  key={problem.id}
                  onClick={() => navigate(`/problem/${problem.id}`)}
                  className="
                  flex items-center justify-between
                  bg-[#0b1313]
                  border border-[#00ff88]/20
                  p-4
                  cursor-pointer
                  hover:border-[#00ff88]
                  hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]
                  transition
                  "
                >
                  <span className="font-semibold">
                    {problem.title}
                  </span>

                  <span
                    className={`
                      text-xs
                      px-3
                      py-1
                      border
                      uppercase
                      tracking-wider
                      ${difficultyColor}
                    `}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;