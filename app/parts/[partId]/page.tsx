// Part Detail Page
import { NextPage } from 'next';

interface Props {
  params: {
    partId: string;
  };
}

const PartDetailPage: NextPage<Props> = ({ params }) => {
  return (
    <div>
      <h1>Part {params.partId}</h1>
      <p>Select an exercise from this part.</p>
    </div>
  );
};

export default PartDetailPage;