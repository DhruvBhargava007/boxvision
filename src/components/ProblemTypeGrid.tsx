import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2em;
  color: #333;
`;

const Header = styled.div`
  background-color: #4169e1;
  color: white;
  padding: 30px 20px;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 2.5em;
  font-weight: 600;
`;

const HeaderSubtitle = styled.h2`
  margin: 10px 0 0;
  font-size: 1.2em;
  font-weight: 400;
  opacity: 0.9;
`;

const problemTypes = [
  {
    id: 'general-storage',
    title: 'General Storage Pallet Full',
    icon: '📦'
  },
  {
    id: 'irs-pallet',
    title: 'IRS Pallet Full',
    icon: '🔄'
  },
  {
    id: 'live-problem',
    title: 'Live Problem Solve Errors',
    icon: '⚡'
  },
  {
    id: 'seller-blocked',
    title: 'Seller Blocked',
    icon: '🚫'
  },
  {
    id: 'missing-expiration',
    title: 'Missing Expiration',
    icon: '📅'
  },
  {
    id: 'no-printable-label',
    title: 'No Printable Label',
    icon: '🏷️'
  },
  {
    id: 'shelf-errors',
    title: 'Shelf Errors',
    icon: '🗄️'
  },
  {
    id: 'brand-feedback',
    title: 'Brand Feedback',
    icon: '💬'
  },
  {
    id: 'research-request',
    title: 'Research Request',
    icon: '🔍'
  },
  {
    id: 'general-ticket',
    title: 'General Ticket',
    icon: '📝'
  }
];

const ProblemTypeGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (problemType: string) => {
    navigate(`/form/${problemType}`);
  };

  return (
    <div>
      <Header>
        <HeaderTitle>Warehouse Problem Solver</HeaderTitle>
        <HeaderSubtitle>Quick Problem Resolution</HeaderSubtitle>
      </Header>
      <GridContainer>
        {problemTypes.map((type) => (
          <Card key={type.id} onClick={() => handleCardClick(type.id)}>
            <span style={{ fontSize: '2em' }}>{type.icon}</span>
            <Title>{type.title}</Title>
          </Card>
        ))}
      </GridContainer>
    </div>
  );
};

export default ProblemTypeGrid; 