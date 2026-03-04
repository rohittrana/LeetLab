import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon, Plus, Search, Filter, Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import { useActions } from "../store/useActions";
import AddToPlaylistModal from "./AddToPlaylistModal";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .llpt {
      --green:  #00ff88;
      --green2: #00cc6a;
      --yellow: #ffd600;
      --red:    #ff3e5e;
      --cyan:   #00e5ff;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --bg3:    #0d1818;
      --border: rgba(0,255,136,0.13);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
      width: 100%;
    }

    @keyframes llpt-fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llpt-blink  { 0%,100%{opacity:1} 50%{opacity:0} }

    /* ── toolbar ── */
    .llpt-toolbar {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: .75rem;
      margin-bottom: 1.25rem;
      animation: llpt-fadeUp .4s ease both;
    }
    .llpt-toolbar-left  { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
    .llpt-toolbar-right { display: flex; align-items: center; gap: .5rem; }

    /* search */
    .llpt-search-wrap {
      position: relative; display: flex; align-items: center;
    }
    .llpt-search-icon {
      position: absolute; left: .7rem; color: rgba(0,255,136,.35); pointer-events: none;
    }
    .llpt-search {
      background: rgba(0,0,0,.5); border: 1px solid var(--border);
      color: #e0ffe8; font-family: var(--mono); font-size: .78rem;
      padding: .5rem .75rem .5rem 2.1rem;
      outline: none; width: 220px;
      transition: border-color .2s, box-shadow .2s;
    }
    .llpt-search::placeholder { color: rgba(224,255,232,.2); }
    .llpt-search:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(0,255,136,.07); }

    /* filter selects */
    .llpt-select {
      background: rgba(0,0,0,.5); border: 1px solid var(--border);
      color: rgba(224,255,232,.6); font-family: var(--mono); font-size: .72rem;
      letter-spacing: .08em; padding: .5rem .75rem;
      outline: none; cursor: pointer;
      transition: border-color .2s;
      -webkit-appearance: none;
    }
    .llpt-select:focus { border-color: var(--green); }
    .llpt-select option { background: #0a1010; }

    /* create playlist btn */
    .llpt-create-btn {
      font-family: var(--mono); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase;
      font-weight: 700; padding: .5rem 1rem;
      border: none; background: var(--green); color: #050a0a;
      cursor: pointer; display: flex; align-items: center; gap: .4rem;
      transition: background .2s, transform .15s; white-space: nowrap;
    }
    .llpt-create-btn:hover { background: #fff; transform: translateY(-1px); }

    /* ── table wrapper ── */
    .llpt-table-wrap {
      border: 1px solid var(--border);
      overflow-x: auto;
      animation: llpt-fadeUp .45s .05s ease both;
      position: relative;
    }
    .llpt-table-wrap::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: .3; pointer-events: none;
    }

    /* ── table ── */
    .llpt-table {
      width: 100%; border-collapse: collapse;
      font-size: .8rem;
    }

    .llpt-thead tr {
      background: rgba(0,255,136,.04);
      border-bottom: 1px solid var(--border);
    }
    .llpt-th {
      padding: .75rem 1rem;
      font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
      color: rgba(0,255,136,.5); font-weight: 400; text-align: left;
      white-space: nowrap;
    }
    .llpt-th:first-child { width: 60px; text-align: center; }

    .llpt-tr {
      border-bottom: 1px solid rgba(0,255,136,.06);
      transition: background .15s;
    }
    .llpt-tr:last-child { border-bottom: none; }
    .llpt-tr:hover { background: rgba(0,255,136,.03); }
    .llpt-tr.solved { background: rgba(0,255,136,.02); }

    .llpt-td {
      padding: .85rem 1rem;
      color: rgba(224,255,232,.7);
      vertical-align: middle;
    }
    .llpt-td:first-child { text-align: center; }

    /* solved checkbox */
    .llpt-check {
      width: 14px; height: 14px;
      border: 1px solid var(--border);
      background: transparent;
      appearance: none; cursor: default;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      position: relative;
    }
    .llpt-check:checked { border-color: var(--green); background: rgba(0,255,136,.15); }
    .llpt-check:checked::after {
      content: '✓'; position: absolute;
      font-size: 9px; color: var(--green); line-height: 1;
    }

    /* title link */
    .llpt-title-link {
      color: #e0ffe8; text-decoration: none; font-family: var(--sans);
      font-weight: 700; font-size: .85rem; letter-spacing: -.01em;
      transition: color .2s;
    }
    .llpt-title-link:hover { color: var(--green); }

    /* tags */
    .llpt-tags { display: flex; flex-wrap: wrap; gap: .3rem; }
    .llpt-tag {
      font-size: .58rem; letter-spacing: .12em; text-transform: uppercase;
      padding: .2rem .5rem; border: 1px solid rgba(255,214,0,.25);
      color: rgba(255,214,0,.7);
    }

    /* difficulty badge */
    .llpt-diff {
      font-size: .6rem; letter-spacing: .16em; text-transform: uppercase;
      padding: .25rem .65rem; border: 1px solid;
      display: inline-block; white-space: nowrap;
    }
    .llpt-diff.easy   { color: var(--green);  border-color: rgba(0,255,136,.3);  background: rgba(0,255,136,.06); }
    .llpt-diff.medium { color: var(--yellow); border-color: rgba(255,214,0,.3);  background: rgba(255,214,0,.06); }
    .llpt-diff.hard   { color: var(--red);    border-color: rgba(255,62,94,.3);  background: rgba(255,62,94,.06); }

    /* action buttons */
    .llpt-actions { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
    .llpt-action-btn {
      width: 30px; height: 30px; border: 1px solid var(--border);
      background: transparent; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: rgba(224,255,232,.4);
      transition: all .2s;
    }
    .llpt-action-btn:hover:not(:disabled) { border-color: var(--green); color: var(--green); background: rgba(0,255,136,.06); }
    .llpt-action-btn.del:hover { border-color: var(--red); color: var(--red); background: rgba(255,62,94,.06); }
    .llpt-action-btn.edit:hover { border-color: var(--yellow); color: var(--yellow); background: rgba(255,214,0,.06); }
    .llpt-action-btn:disabled { opacity: .25; cursor: not-allowed; }
    .llpt-save-btn {
      display: flex; align-items: center; gap: .4rem;
      padding: .35rem .75rem; border: 1px solid var(--border);
      background: transparent; cursor: pointer;
      color: rgba(224,255,232,.4); font-family: var(--mono);
      font-size: .62rem; letter-spacing: .1em; text-transform: uppercase;
      transition: all .2s; white-space: nowrap;
    }
    .llpt-save-btn:hover { border-color: var(--cyan); color: var(--cyan); background: rgba(0,229,255,.05); }

    /* empty */
    .llpt-empty {
      padding: 3rem 1rem; text-align: center;
      font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
      color: rgba(0,255,136,.25);
    }

    /* ── pagination ── */
    .llpt-pagination {
      display: flex; align-items: center; justify-content: center; gap: .4rem;
      margin-top: 1.25rem;
      animation: llpt-fadeUp .45s .1s ease both;
    }
    .llpt-page-btn {
      width: 32px; height: 32px; border: 1px solid var(--border);
      background: transparent; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: rgba(224,255,232,.4); font-family: var(--mono); font-size: .72rem;
      transition: all .2s;
    }
    .llpt-page-btn:hover:not(:disabled) { border-color: var(--green); color: var(--green); background: rgba(0,255,136,.06); }
    .llpt-page-btn:disabled { opacity: .25; cursor: not-allowed; }
    .llpt-page-count {
      font-size: .68rem; letter-spacing: .14em;
      color: rgba(0,255,136,.4); padding: 0 .5rem;
    }
    .llpt-page-count span { color: var(--green); }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();

  const [search, setSearch]               = useState("");
  const [difficulty, setDifficulty]       = useState("ALL");
  const [selectedTag, setSelectedTag]     = useState("ALL");
  const [currentPage, setCurrentPage]     = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen]         = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId]         = useState(null);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const set = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => difficulty === "ALL" || p.difficulty === difficulty)
      .filter((p) => selectedTag === "ALL" || p.tags?.includes(selectedTag));
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / itemsPerPage));
  const paginatedProblems = useMemo(() =>
    filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredProblems, currentPage]
  );

  const diffClass = (d) => d === "EASY" ? "easy" : d === "MEDIUM" ? "medium" : "hard";

  return (
    <div className="llpt">
      <Styles />

      {/* ── Toolbar ── */}
      <div className="llpt-toolbar">
        <div className="llpt-toolbar-left">
          {/* Search */}
          <div className="llpt-search-wrap">
            <Search size={13} className="llpt-search-icon" />
            <input
              type="text"
              className="llpt-search"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {/* Difficulty */}
          <select className="llpt-select" value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}>
            <option value="ALL">All Difficulty</option>
            {["EASY","MEDIUM","HARD"].map((d) => (
              <option key={d} value={d}>{d.charAt(0)+d.slice(1).toLowerCase()}</option>
            ))}
          </select>

          {/* Tag */}
          <select className="llpt-select" value={selectedTag}
            onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}>
            <option value="ALL">All Tags</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="llpt-toolbar-right">
          <button className="llpt-create-btn" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={13} /> New Playlist
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="llpt-table-wrap">
        <table className="llpt-table">
          <thead className="llpt-thead">
            <tr>
              <th className="llpt-th">Done</th>
              <th className="llpt-th">Title</th>
              <th className="llpt-th">Tags</th>
              <th className="llpt-th">Difficulty</th>
              <th className="llpt-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.length > 0 ? paginatedProblems.map((problem) => {
              const isSolved = problem.solvedBy?.some((u) => u.userId === authUser?.id) || false;
              return (
                <tr key={problem.id} className={`llpt-tr${isSolved ? " solved" : ""}`}>
                  {/* Solved */}
                  <td className="llpt-td">
                    <input type="checkbox" readOnly checked={isSolved} className="llpt-check" />
                  </td>

                  {/* Title */}
                  <td className="llpt-td">
                    <Link to={`/problem/${problem.id}`} className="llpt-title-link">
                      {problem.title}
                    </Link>
                  </td>

                  {/* Tags */}
                  <td className="llpt-td">
                    <div className="llpt-tags">
                      {(problem.tags || []).map((tag, i) => (
                        <span key={i} className="llpt-tag">{tag}</span>
                      ))}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="llpt-td">
                    <span className={`llpt-diff ${diffClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="llpt-td">
                    <div className="llpt-actions">
                      {authUser?.role === "ADMIN" && (
                        <>
                          <button className="llpt-action-btn del" onClick={() => onDeleteProblem(problem.id)} title="Delete">
                            <TrashIcon size={13} />
                          </button>
                          <button className="llpt-action-btn edit" disabled title="Edit (coming soon)">
                            <PencilIcon size={13} />
                          </button>
                        </>
                      )}
                      <button className="llpt-save-btn" onClick={() => { setSelectedProblemId(problem.id); setIsAddToPlaylistModalOpen(true); }}>
                        <Bookmark size={12} />
                        <span>Save</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="llpt-empty">
                  // no problems found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="llpt-pagination">
          <button className="llpt-page-btn" disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}>
            <ChevronLeft size={14} />
          </button>
          <span className="llpt-page-count">
            <span>{currentPage}</span> / {totalPages}
          </span>
          <button className="llpt-page-btn" disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data) => { await createPlaylist(data); }}
      />
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsTable;