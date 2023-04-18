{
  description = "Flake utils demo";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [
        ];

        pkgs = import nixpkgs {
          inherit overlays system;
        };
      in
      {
        devShells = rec {
          default = empty;

          empty = pkgs.mkShell {
            buildInputs = with pkgs; [
              python39
              ffmpeg_5-full
              python39.pkgs.venvShellHook
            ];
            venvDir = ".venv";
          };
        };
      }
    );
}
