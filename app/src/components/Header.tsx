import styled from 'styled-components'

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <HeaderWrapper>
      <HeaderSection>
        <HeaderLink bold href="/">
          Simple
        </HeaderLink>
        <HeaderLink href="/">new page</HeaderLink>
        <HeaderLink href="/">save</HeaderLink>
      </HeaderSection>
      <HeaderSection>
        <HeaderLink semibold href="/">
          ~username
        </HeaderLink>
        <HeaderLink href="/">sign out</HeaderLink>
      </HeaderSection>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  font-size: 14px;
  padding: 5px 15px;
  height: 28px;

  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`

const HeaderLink = styled.a<{ bold?: boolean; semibold?: boolean }>`
  color: inherit;
  text-decoration: none;

  font-weight: ${(props) => (props.bold ? 700 : props.semibold ? 600 : 500)};

  &:hover,
  &:focus {
    color: ${(props) => props.theme.link};
    text-decoration: underline;
  }
`

const HeaderSection = styled.div`
  ${HeaderLink}:not(:last-child) {
    margin-right: 15px;
  }
`
