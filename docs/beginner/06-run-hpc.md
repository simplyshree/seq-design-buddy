# Run HPC

Purpose: Prepare a network-free compute job for cluster execution.

Prerequisites: Cluster access, staged repository, environment, datasets, and model weights.

Steps:

1. Prepare the repository on a login or setup node.
2. Build or load the environment before submission.
3. Stage datasets and model weights.
4. Verify the environment.
5. Submit the Slurm job.
6. Collect artifacts from the output directory.

Expected output: Slurm logs plus benchmark artifacts.

Common errors: Cloning GitHub inside a compute job, downloading packages during compute, or missing model weights.

Verify success: The job script contains no network setup commands.

Next step: Compare models.
