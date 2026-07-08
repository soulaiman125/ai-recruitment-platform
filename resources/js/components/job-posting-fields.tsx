import { X } from 'lucide-react';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS,
    JOB_STATUSES,
    WORK_MODES,
} from '@/types/job';
import type { JobPosting } from '@/types/job';

type JobPostingFieldsProps = {
    job?: JobPosting;
    errors: Partial<Record<string, string>>;
};

export default function JobPostingFields({
    job,
    errors,
}: JobPostingFieldsProps) {
    const [skills, setSkills] = useState<string[]>(job?.skills ?? []);
    const [skillInput, setSkillInput] = useState('');

    const addSkill = () => {
        const skill = skillInput.trim();

        if (skill === '' || skills.includes(skill)) {
            setSkillInput('');

            return;
        }

        setSkills([...skills, skill]);
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter((current) => current !== skill));
    };

    // Enter would otherwise submit the surrounding form.
    const handleSkillKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addSkill();
        }
    };

    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>

                <Input
                    id="title"
                    name="title"
                    defaultValue={job?.title}
                    required
                    placeholder="Senior Laravel Developer"
                />

                <InputError message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>

                <Textarea
                    id="description"
                    name="description"
                    defaultValue={job?.description}
                    required
                    rows={6}
                    placeholder="Describe the role, the team, and the mission"
                />

                <InputError message={errors.description} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="requirements">Requirements</Label>

                <Textarea
                    id="requirements"
                    name="requirements"
                    defaultValue={job?.requirements ?? ''}
                    rows={4}
                    placeholder="What the candidate must bring to the role"
                />

                <InputError message={errors.requirements} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="skills">Skills</Label>

                {skills.map((skill) => (
                    <input
                        key={skill}
                        type="hidden"
                        name="skills[]"
                        value={skill}
                    />
                ))}

                <div className="flex gap-2">
                    <Input
                        id="skills"
                        value={skillInput}
                        onChange={(event) => setSkillInput(event.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Type a skill, then press Enter"
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={addSkill}
                    >
                        Add
                    </Button>
                </div>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="gap-1 pr-1"
                            >
                                {skill}

                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    aria-label={`Remove ${skill}`}
                                    className="rounded-sm opacity-60 transition-opacity hover:opacity-100"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                <InputError message={errors.skills} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>

                <Input
                    id="location"
                    name="location"
                    defaultValue={job?.location ?? ''}
                    placeholder="Tanger, Morocco"
                />

                <InputError message={errors.location} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="employment_type">Employment type</Label>

                    <Select
                        name="employment_type"
                        defaultValue={job?.employment_type ?? undefined}
                    >
                        <SelectTrigger id="employment_type" className="w-full">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>

                        <SelectContent>
                            {EMPLOYMENT_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <InputError message={errors.employment_type} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="work_mode">Work mode</Label>

                    <Select
                        name="work_mode"
                        defaultValue={job?.work_mode ?? undefined}
                    >
                        <SelectTrigger id="work_mode" className="w-full">
                            <SelectValue placeholder="Select a mode" />
                        </SelectTrigger>

                        <SelectContent>
                            {WORK_MODES.map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                    {mode}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <InputError message={errors.work_mode} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="experience_level">Experience level</Label>

                    <Select
                        name="experience_level"
                        defaultValue={job?.experience_level ?? undefined}
                    >
                        <SelectTrigger id="experience_level" className="w-full">
                            <SelectValue placeholder="Select a level" />
                        </SelectTrigger>

                        <SelectContent>
                            {EXPERIENCE_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <InputError message={errors.experience_level} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="salary_min">Salary min</Label>

                    <Input
                        id="salary_min"
                        name="salary_min"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={job?.salary_min ?? ''}
                        placeholder="0.00"
                    />

                    <InputError message={errors.salary_min} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="salary_max">Salary max</Label>

                    <Input
                        id="salary_max"
                        name="salary_max"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={job?.salary_max ?? ''}
                        placeholder="0.00"
                    />

                    <InputError message={errors.salary_max} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="deadline">Deadline</Label>

                    <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        defaultValue={job?.deadline ?? ''}
                    />

                    <InputError message={errors.deadline} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>

                <Select name="status" defaultValue={job?.status ?? 'draft'}>
                    <SelectTrigger id="status" className="w-full md:w-1/3">
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>

                    <SelectContent>
                        {JOB_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <InputError message={errors.status} />
            </div>
        </>
    );
}
