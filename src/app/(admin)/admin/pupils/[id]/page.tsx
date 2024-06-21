import React from "react";
import BackButton from "../../tasters/@show/_backButton";

const PupilShow = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      Pupil ID: {params.id} <BackButton />
    </div>
  );
};

export default PupilShow;
