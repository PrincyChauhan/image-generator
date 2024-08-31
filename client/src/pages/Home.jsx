import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import SearchBar from "../components/SearchBar";
import ImageCard from "../components/cards/ImageCard";
import { GetPosts } from "../apis";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  padding: 30px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
  background: ${({ theme }) => theme.background};
`;

const HeadLine = styled.div`
  font-size: 34px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Span = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.secondary};
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardWrapper = styled.div`
  display: grid;
  gap: 20px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 640px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 639px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filteredPost, setFilteredPost] = useState([]);

  const staticPosts = useMemo(
    () => [
      {
        id: 1,
        prompt: "A beautiful sunset over a calm lake",
        name: "John Doe",
        photo:
          "https://img.freepik.com/premium-photo/beautiful-sunset-calm-lake-with-tall-grasses-foreground_14117-578815.jpg",
      },
      {
        id: 2,
        prompt: "A snowy mountain peak with a clear blue sky",
        name: "Jane Smith",
        photo:
          "https://images.stockcake.com/public/9/7/d/97d52752-a5a4-4349-8465-afda1de2e3e7_large/snowy-mountain-peaks-stockcake.jpg",
      },
    ],
    []
  );
  const getPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetPosts();
      const postData = res?.data?.data || [];
      setPosts(postData);
      setFilteredPost([...staticPosts, ...postData]);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch posts");
      setFilteredPost(staticPosts);
    } finally {
      setLoading(false);
    }
  }, [staticPosts]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  useEffect(() => {
    if (!search) {
      setFilteredPost([...staticPosts, ...posts]);
      // } else if (posts?.length || staticPosts?.length) {
      //   const filteredPosts = [...staticPosts, ...posts].filter((post) => {
      //     const promptMatch = post?.prompt?.toLowerCase().includes(search);
      //     const authorMatch = post?.author?.toLowerCase().includes(search);

      //     return promptMatch || authorMatch;
      //   });

      // setFilteredPost(filteredPosts);
    }
  }, [posts, search, staticPosts]);

  return (
    <Container>
      <HeadLine>
        Welcome to Popular Posts!
        <Span>Generated with AI</Span>
      </HeadLine>
      <SearchBar
        search={search}
        handleChange={(e) => setSearch(e.target.value)}
      />
      <Wrapper>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {loading ? (
          <CircularProgress />
        ) : (
          <CardWrapper>
            {filteredPost?.length > 0 ? (
              filteredPost
                .slice()
                .reverse()
                .map((item, index) =>
                  item ? <ImageCard key={index} item={item} /> : null
                )
            ) : (
              <>No Posts Found !!</>
            )}
          </CardWrapper>
        )}
      </Wrapper>
    </Container>
  );
};

export default Home;
