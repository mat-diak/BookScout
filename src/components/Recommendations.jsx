import Button from "./Button";
import * as S from "../Styles";
import { useDispatch, useSelector } from "react-redux";
import { getImgUrl } from "../helpers/links";
import { selectTitle } from "../store/mainSlice";
import * as Animation from "../styled-components/Animations.styled";

const Recommendations = () => {
  const { tags, results } = useSelector((state) => state.recommendations);
  const dispatch = useDispatch();

  return (
    <div>
      <S.Recommendations.Header>
        What are you interested in?
      </S.Recommendations.Header>
      <S.Recommendations.ChoiceWrapper>
        {tags.map((tag) => (
          <Button tag={tag} key={tag} />
        ))}
      </S.Recommendations.ChoiceWrapper>
      <Animation.FadeIn>
        <S.Recommendations.Gallery>
          {results.map((book) => {
            return (
              <S.Recommendations.ImageWrapper
                key={book.isbn}
                onClick={() => dispatch(selectTitle(book))}
              >
                <S.Recommendations.Image
                  src={getImgUrl(book.isbn)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = thumbnailTemplate;
                  }}
                />
                <S.Recommendations.DetailsOverlay id="overlay">
                  <S.Recommendations.Heading>
                    <h3>{book.title}</h3>
                    <address>{book.author}</address>
                  </S.Recommendations.Heading>
                </S.Recommendations.DetailsOverlay>
              </S.Recommendations.ImageWrapper>
            );
          })}
        </S.Recommendations.Gallery>
      </Animation.FadeIn>
    </div>
  );
};

export default Recommendations;
