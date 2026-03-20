import React from "react";
import { Trophy, Medal, Crown, Flame } from "lucide-react";

const users = [
  { rank: 1, name: "Rohit Rana", solved: 420, score: 9800 },
  { rank: 2, name: "Alex Chen", solved: 390, score: 9100 },
  { rank: 3, name: "Priya Sharma", solved: 370, score: 8800 },
  { rank: 4, name: "David Kim", solved: 340, score: 8400 },
  { rank: 5, name: "Sarah Johnson", solved: 320, score: 8100 },
  { rank: 6, name: "Aman Singh", solved: 310, score: 7900 },
  { rank: 7, name: "Emily Wang", solved: 295, score: 7600 },
  { rank: 8, name: "Arjun Patel", solved: 280, score: 7300 },
];

const LeaderboardPage = () => {
  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="min-h-screen bg-[#050a0a] text-[#e0ffe8] px-6 py-10">

      {/* TITLE */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Trophy className="text-[#00ff88]" />
          Global Leaderboard
        </h1>
        <p className="text-gray-400 mt-2">
          Top coders competing on LeetLab
        </p>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="flex justify-center items-end gap-8 mb-16">

        {/* SECOND */}
        <div className="text-center">
          <div className="bg-[#0b1313] border border-[#00ff88]/30 p-6 w-40">
            <Medal className="mx-auto text-gray-300 mb-2" size={30} />
            <h2 className="font-bold">{top3[1].name}</h2>
            <p className="text-sm text-gray-400">
              {top3[1].solved} solved
            </p>
          </div>
          <div className="h-20 bg-[#00ff88]/10 mt-2"></div>
        </div>

        {/* FIRST */}
        <div className="text-center scale-110">
          <div className="bg-[#0b1313] border border-[#00ff88] p-6 w-48 shadow-[0_0_25px_rgba(0,255,136,0.3)]">
            <Crown className="mx-auto text-yellow-400 mb-2" size={36} />
            <h2 className="font-bold text-lg">{top3[0].name}</h2>
            <p className="text-sm text-gray-400">
              {top3[0].solved} solved
            </p>
          </div>
          <div className="h-28 bg-[#00ff88]/20 mt-2"></div>
        </div>

        {/* THIRD */}
        <div className="text-center">
          <div className="bg-[#0b1313] border border-[#00ff88]/30 p-6 w-40">
            <Medal className="mx-auto text-orange-400 mb-2" size={30} />
            <h2 className="font-bold">{top3[2].name}</h2>
            <p className="text-sm text-gray-400">
              {top3[2].solved} solved
            </p>
          </div>
          <div className="h-16 bg-[#00ff88]/10 mt-2"></div>
        </div>

      </div>

      {/* TABLE */}
      <div className="max-w-4xl mx-auto border border-[#00ff88]/20 bg-[#0b1313]">

        <table className="w-full text-sm">

          <thead className="border-b border-[#00ff88]/20 text-gray-400">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Problems Solved</th>
              <th className="p-4 text-left">Score</th>
            </tr>
          </thead>

          <tbody>
            {others.map((user) => (
              <tr
                key={user.rank}
                className="border-b border-[#00ff88]/10 hover:bg-[#00ff88]/5 transition"
              >
                <td className="p-4 font-bold text-[#00ff88]">
                  #{user.rank}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <Flame className="text-orange-400" size={16} />
                  {user.name}
                </td>

                <td className="p-4">
                  {user.solved}
                </td>

                <td className="p-4 text-[#00ff88] font-semibold">
                  {user.score}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default LeaderboardPage;