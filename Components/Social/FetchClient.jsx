"use client";
import React, { useEffect, useMemo, useState } from "react";

function truncateString(str, maxLength) {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
}
function getMetric(item, key) {
  // 1) top-level fields (like_count, comments_count, etc.)
  const top = item?.[key];
  if (typeof top === "number") return top;

  // 2) insights_map fields (reach, saved, shares, etc.)
  const ins = item?.insights_map?.[key];
  if (typeof ins === "number") return ins;

  // 3) if Meta returns string numbers sometimes
  const topNum = Number(top);
  if (Number.isFinite(topNum)) return topNum;

  const insNum = Number(ins);
  if (Number.isFinite(insNum)) return insNum;

  return 0;
}
export default function FetchClient() {
  const [baseData, setBaseData] = useState([]); // ✅ source of truth
  const [sortKey, setSortKey] = useState("");
  const [mediaType, setMediaType] = useState("");

  const filters = [
    { key: "ig_reels_avg_watch_time", label: "Average Watch Time" },
    { key: "shares", label: "Shares" },
    { key: "comments_count", label: "Comments" },
    { key: "like_count", label: "Likes" },
    { key: "reach", label: "Reach" },
    { key: "saved", label: "Saved" },
    { key: "total_interactions", label: "Total Interactions" },
    { key: "views", label: "Views" },
  ];

  const mediaTypeFilters = [
    { key: "IMAGE", label: "Images" },
    { key: "VIDEO", label: "Videos" },
    { key: "CAROUSEL_ALBUM", label: "Carousels" },
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/instagram/media/insights", {
        cache: "no-store",
      });
      const json = await res.json();
      console.log(json.data);

      setBaseData(json.data);
    })();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let out = baseData;

    if (mediaType) out = out.filter((x) => x?.media_type === mediaType);

    if (sortKey) {
      out = [...out].sort(
        (a, b) => getMetric(b, sortKey) - getMetric(a, sortKey)
      );
    } else {
      out = [...out].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    return out;
  }, [baseData, mediaType, sortKey]);

  function onSortClick(key) {
    // toggle sort on/off
    setSortKey((prev) => (prev === key ? "" : key));
  }

  function onMediaTypeClick(key) {
    // toggle media type on/off
    setMediaType((prev) => (prev === key ? "" : key));
  }

  function resetAll() {
    setSortKey("");
    setMediaType("");
  }

  return (
    <>
      <style>
        {`
.paCtn {
    padding: 40px;
}

.dataFilters {
    display: flex;
    gap: 10px;
    margin: 50px 0;
    flex-wrap: wrap;
}

.dataFilter {
    display: flex;
    border: 1px solid black;
    background: white;
    color: black;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
}
.dataFilter.active{
    background: black;
    color: white;
}
.dataCtn {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
}

.tag {
    font-weight: 600;
    color: white;
    background: brown;
    width: fit-content;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 0 0 10px;
    font-size: 12px;
}

.mediaTitle {
    margin-bottom: 20px;
}
      `}
      </style>
      <div className="paCtn">
        <div className="paDiv">
          <h1 className="paTitle">
            {baseData.length > 0 ? "Dashboard" : "Loading..."}{" "}
          </h1>
          {/* Row 1: media type filter */}
          <div className="dataFilters">
            <button
              onClick={resetAll}
              className={
                "dataFilter " + (!mediaType && !sortKey ? "active" : "")
              }
              disabled={baseData.length === 0}
            >
              All (Date)
            </button>

            {mediaTypeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => onMediaTypeClick(f.key)}
                className={
                  "dataFilter " + (mediaType === f.key ? "active" : "")
                }
                disabled={baseData.length === 0}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Row 2: metric sort (stacks with media type) */}
          <div className="dataFilters">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => onSortClick(filter.key)}
                className={
                  "dataFilter " + (sortKey === filter.key ? "active" : "")
                }
                disabled={baseData.length === 0}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="dataCtn">
            {filteredAndSorted.map((item, index) => (
              <div key={index} className="dataItem">
                <p className="tag">{item.media_type}</p>
                <h2 className="mediaTitle">
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {truncateString(item.caption, 50)}
                  </a>
                </h2>
                <SubText title="Date" value={item.insights_map?.shares} />
                <SubText title="Shares" value={item.insights_map?.shares} />
                <SubText title="Comments" value={item.comments_count} />
                <SubText title="Likes" value={item.like_count} />
                <SubText title="Reach" value={item.insights_map?.reach} />
                <SubText title="Saved" value={item.insights_map?.saved} />
                <SubText title="Views" value={item.insights_map?.views} />

                <SubText
                  title="Total Interactions"
                  value={item.insights_map?.total_interactions}
                />
                {/* <p className="subText">Views: {item.view_count}</p>
                  <p className="subText">Views: {item.view_count}</p>
                  <p className="subText">Views: {item.view_count}</p> */}
                {item.media_type == "VIDEO" && (
                  <>
                    <SubText
                      title="Average Watch Time"
                      value={`${item.insights_map?.ig_reels_avg_watch_time / 1000}s`}
                    />
                    <SubText
                      title="Total Watch Time"
                      value={`${item.insights_map?.ig_reels_video_view_total_time / 1000}s`}
                    />
                  </>
                )}
                {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SubText({ title, value }) {
  return (
    <p className="subText">
      <strong>{title}:</strong> {value}
    </p>
  );
}
