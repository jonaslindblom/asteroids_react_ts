import TextPageBase from "src/components/TextPageBase/TextPageBase";

export default function Privacy() {
  return (
    <TextPageBase title="Privacy Policy">
      <div>
        <p>
          This Privacy Policy explains how we collect, use, and disclose
          personal information in connection with the game.
        </p>
        <p>
          By accessing and playing the game, you agree to the terms and
          practices described in this Privacy Policy.
        </p>
        <p>
          <strong>Information We Collect</strong>: We do not collect or store
          any personal information about you while you play the game. We respect
          your privacy and have implemented measures to ensure that no personal
          data is collected or shared.
        </p>
        <p>
          <strong>Device High Score:</strong> To enhance your gaming experience,
          we do save your high score in the local browser storage. This high
          score is only stored on your device and is not transmitted or shared
          with any third parties. It is solely used to display your personal
          high score on the welcome screen for your convenience.
        </p>
        <p>
          <strong>Data Security:</strong> We take data security seriously and
          have implemented appropriate technical and organizational measures to
          protect your high score stored in the local browser storage. However,
          please note that no method of transmission or storage is completely
          secure, and we cannot guarantee the absolute security of your high
          score.
        </p>
        <p>
          <strong>Updates to this Privacy Policy:</strong> We may update this
          Privacy Policy from time to time. Any changes will be effective upon
          posting the updated Privacy Policy on our website. We encourage you to
          review this Privacy Policy periodically.
        </p>
        <p>
          <strong>Contact Us:</strong> If you have any questions or concerns
          about this Privacy Policy or how we handle your personal information,
          please contact us&nbsp;
          <a href="mailto:privacy@tomatoracer.com">here</a>.
        </p>
      </div>
    </TextPageBase>
  );
}
