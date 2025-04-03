import styled from 'styled-components';

export const GardenPageWrapper = styled.div`
  .stats-cards {
    margin-bottom: 24px;
  }
  
  .stat-card {
    text-align: center;
    border-radius: 8px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    h2 {
      color: #52c41a;
      margin-bottom: 0;
    }
    
    p {
      margin-bottom: 0;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  
  .main-content {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
  }
  
  .garden-tabs {
    min-height: 500px;
    
    .ant-tabs-content {
      padding: 0 24px;
    }
  }
`;