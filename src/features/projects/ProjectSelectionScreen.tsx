import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Project } from "../../core/types";
import { useAppState } from "../../core/state/AppState";

// ── Project row (shared between recent list and search results) ───────────────
function ProjectRow({
  project,
  onSelect,
  indent = false,
}: {
  project: Project;
  onSelect: (id: string) => void;
  indent?: boolean;
}) {
  const isSubSite = !!project.parentCode;
  return (
    <ListItemButton
      onClick={() => onSelect(project.id)}
      sx={{ pl: indent || isSubSite ? 4 : 2, pr: 2, py: 1.2 }}
    >
      {isSubSite && (
        <SubdirectoryArrowRightIcon
          sx={{ fontSize: 16, color: "text.disabled", mr: 1, flexShrink: 0 }}
        />
      )}
      <ListItemText
        primary={
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography component="span" variant="body2" fontWeight={isSubSite ? 400 : 600}>
              {project.cmicCode}
            </Typography>
            <Typography component="span" variant="body2" color="text.secondary">
              —
            </Typography>
            <Typography component="span" variant="body2" fontWeight={isSubSite ? 400 : 600}>
              {project.name}
            </Typography>
          </Box>
        }
        secondary={
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
            <LocationOnIcon sx={{ fontSize: 12, color: "text.disabled" }} />
            <Typography component="span" variant="caption" color="text.secondary">
              {project.location}
            </Typography>
          </Box>
        }
      />
      <Chip
        size="small"
        label={isSubSite ? "Sub-site" : "Main"}
        color={project.status === "active" ? (isSubSite ? "default" : "primary") : "default"}
        variant={project.status === "active" ? "filled" : "outlined"}
        sx={{ height: 20, fontSize: "0.68rem", ml: 1, flexShrink: 0 }}
      />
    </ListItemButton>
  );
}

// ── Grouped search results rendered as a parent→children tree ─────────────────
function GroupedResults({
  results,
  allProjects,
  onSelect,
}: {
  results: Project[];
  allProjects: Project[];
  onSelect: (id: string) => void;
}) {
  // Split into parents (no parentCode) and sub-sites
  const parents = results.filter(p => !p.parentCode);
  const subsInResults = new Set(results.filter(p => !!p.parentCode).map(p => p.id));

  // For each parent in results, also show any sub-sites in the full list
  // that matched (even if the parent itself didn't match)
  const orphanSubs = results.filter(
    p => !!p.parentCode && !parents.some(par => par.cmicCode === p.parentCode),
  );

  // Virtual parents for orphan sub-site groups
  const orphanParentCodes = [...new Set(orphanSubs.map(p => p.parentCode!))];
  const orphanParents = orphanParentCodes
    .map(code => allProjects.find(p => p.cmicCode === code))
    .filter(Boolean) as Project[];

  const renderGroup = (parent: Project, isOrphanParent = false) => {
    const children = allProjects.filter(
      p => p.parentCode === parent.cmicCode && (subsInResults.has(p.id) || !isOrphanParent),
    );
    return (
      <Box key={parent.id}>
        <ProjectRow project={parent} onSelect={onSelect} />
        {children.map(child => (
          <ProjectRow key={child.id} project={child} onSelect={onSelect} indent />
        ))}
        <Divider sx={{ mx: 2 }} />
      </Box>
    );
  };

  if (parents.length === 0 && orphanParents.length === 0) {
    return (
      <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">No jobsites match your search.</Typography>
      </Box>
    );
  }

  return (
    <>
      {parents.map(p => renderGroup(p))}
      {orphanParents.map(p => renderGroup(p, true))}
    </>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export function ProjectSelectionScreen() {
  const { projects, recentProjectIds, selectProject } = useAppState();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-focus search on mount
  useEffect(() => {
    const t = setTimeout(() => searchRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  // 250 ms debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Recent jobsites (up to 10, filtered to accessible projects)
  const recentProjects = useMemo(() => {
    return recentProjectIds
      .map(id => projects.find(p => p.id === id))
      .filter(Boolean) as Project[];
  }, [recentProjectIds, projects]);

  // Search results
  const searchResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return projects.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.cmicCode.toLowerCase().includes(q) ||
        p.projectNo.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q),
    );
  }, [debouncedQuery, projects]);

  const isSearching = debouncedQuery.trim().length > 0;

  // Top-level parent projects for the "all projects" section when no search
  const parentProjects = useMemo(
    () => projects.filter(p => !p.parentCode),
    [projects],
  );

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      {/* Header */}
      <Box mb={2.5}>
        <Typography variant="h5" fontWeight={700}>Select Jobsite</Typography>
        <Typography variant="body2" color="text.secondary">
          Search by name, CMIC code, or location. Sub-sites are listed under each jobsite.
        </Typography>
      </Box>

      {/* Search input */}
      <TextField
        inputRef={searchRef}
        placeholder="Search jobsite name, code (018466), or location…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: query ? "primary.main" : "text.disabled" }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2.5 }}
      />

      {/* ── Search results ─────────────────────────────────────────────── */}
      {isSearching && (
        <Paper sx={{ border: "1px solid", borderColor: "divider", mb: 2.5 }}>
          <Box sx={{ px: 2, py: 1.2, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <SearchIcon sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
              Results for "{debouncedQuery}"
            </Typography>
            <Chip
              label={searchResults.length}
              size="small"
              sx={{ height: 18, fontSize: "0.68rem", ml: "auto" }}
            />
          </Box>
          <List disablePadding>
            <GroupedResults results={searchResults} allProjects={projects} onSelect={selectProject} />
          </List>
        </Paper>
      )}

      {/* ── Recent jobsites ────────────────────────────────────────────── */}
      {!isSearching && recentProjects.length > 0 && (
        <Paper sx={{ border: "1px solid", borderColor: "divider", mb: 2.5 }}>
          <Box sx={{ px: 2, py: 1.2, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <AccessTimeIcon sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
              Recent Jobsites
            </Typography>
            <Chip
              label={`Last ${recentProjects.length}`}
              size="small"
              sx={{ height: 18, fontSize: "0.68rem", ml: "auto" }}
            />
          </Box>
          <List disablePadding>
            {recentProjects.map((p, i) => (
              <Box key={p.id}>
                <ProjectRow project={p} onSelect={selectProject} />
                {i < recentProjects.length - 1 && <Divider sx={{ mx: 2 }} />}
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* ── All accessible jobsites ────────────────────────────────────── */}
      {!isSearching && (
        <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ px: 2, py: 1.2, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <AccountTreeIcon sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
              All Assigned Jobsites
            </Typography>
            <Chip
              label={parentProjects.length}
              size="small"
              sx={{ height: 18, fontSize: "0.68rem", ml: "auto" }}
            />
          </Box>
          <List disablePadding>
            {parentProjects.map((parent, i) => {
              const children = projects.filter(p => p.parentCode === parent.cmicCode);
              return (
                <Box key={parent.id}>
                  <ProjectRow project={parent} onSelect={selectProject} />
                  {children.map(child => (
                    <ProjectRow key={child.id} project={child} onSelect={selectProject} indent />
                  ))}
                  {i < parentProjects.length - 1 && <Divider sx={{ mx: 2 }} />}
                </Box>
              );
            })}
          </List>
        </Paper>
      )}

      {/* Hint */}
      {!isSearching && !isMobile && (
        <Stack direction="row" spacing={2} mt={2} justifyContent="center">
          <Typography variant="caption" color="text.disabled">
            Jobsite selection drives all headcount, contractor, and QR data in this session.
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

