import { Form, Head } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Candidate/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { edit } from '@/routes/candidate/profile';
import type { CandidateProfile } from '@/types/candidate';
import { EXPERIENCE_LEVELS } from '@/types/job';

export default function CandidateProfileEdit({
    profile,
}: {
    profile: CandidateProfile;
}) {
    const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
    const [skillInput, setSkillInput] = useState('');

    // Radix renders the checkbox as a button, so the submitted value rides on
    // a hidden input that is always present — otherwise unchecking it would
    // simply omit the field and never persist as `false`.
    const [openToWork, setOpenToWork] = useState(profile.is_open_to_work);

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
            <Head title="My Profile" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="My Profile"
                    description="Fill this in so recruiters see your strengths when you apply"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Basics */}
                            <Heading
                                variant="small"
                                title="Basics"
                                description="How recruiters recognise you at a glance"
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>

                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={profile.title ?? ''}
                                    placeholder="Full-Stack Developer"
                                />

                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>

                                <Textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={profile.bio ?? ''}
                                    rows={6}
                                    placeholder="Tell recruiters about your background, what you build, and what you are looking for"
                                />

                                <InputError message={errors.bio} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>

                                    <Input
                                        id="location"
                                        name="location"
                                        defaultValue={profile.location ?? ''}
                                        placeholder="Tanger, Morocco"
                                    />

                                    <InputError message={errors.location} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>

                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={profile.phone ?? ''}
                                        placeholder="+212 600-000000"
                                    />

                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <Separator />

                            {/* Experience */}
                            <Heading
                                variant="small"
                                title="Experience"
                                description="Where you sit on the seniority ladder"
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="experience_level">
                                        Experience level
                                    </Label>

                                    <Select
                                        name="experience_level"
                                        defaultValue={
                                            profile.experience_level ??
                                            undefined
                                        }
                                    >
                                        <SelectTrigger
                                            id="experience_level"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select a level" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {EXPERIENCE_LEVELS.map((level) => (
                                                <SelectItem
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError
                                        message={errors.experience_level}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="experience_years">
                                        Years of experience
                                    </Label>

                                    <Input
                                        id="experience_years"
                                        name="experience_years"
                                        type="number"
                                        min="0"
                                        max="60"
                                        defaultValue={
                                            profile.experience_years ?? ''
                                        }
                                        placeholder="3"
                                    />

                                    <InputError
                                        message={errors.experience_years}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Skills */}
                            <Heading
                                variant="small"
                                title="Skills"
                                description="The technologies recruiters filter and match you on"
                            />

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
                                        onChange={(event) =>
                                            setSkillInput(event.target.value)
                                        }
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
                                                    onClick={() =>
                                                        removeSkill(skill)
                                                    }
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

                            <Separator />

                            {/* Links */}
                            <Heading
                                variant="small"
                                title="Links"
                                description="Where recruiters can see your work"
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>

                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    type="url"
                                    defaultValue={profile.linkedin ?? ''}
                                    placeholder="https://linkedin.com/in/username"
                                />

                                <InputError message={errors.linkedin} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="github">GitHub</Label>

                                <Input
                                    id="github"
                                    name="github"
                                    type="url"
                                    defaultValue={profile.github ?? ''}
                                    placeholder="https://github.com/username"
                                />

                                <InputError message={errors.github} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="portfolio">Portfolio</Label>

                                <Input
                                    id="portfolio"
                                    name="portfolio"
                                    type="url"
                                    defaultValue={profile.portfolio ?? ''}
                                    placeholder="https://example.com"
                                />

                                <InputError message={errors.portfolio} />
                            </div>

                            <Separator />

                            {/* Availability */}
                            <Heading
                                variant="small"
                                title="Availability"
                                description="Let recruiters know you are on the market"
                            />

                            <div className="grid gap-2">
                                <input
                                    type="hidden"
                                    name="is_open_to_work"
                                    value={openToWork ? '1' : '0'}
                                />

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="is_open_to_work"
                                        checked={openToWork}
                                        onCheckedChange={(checked) =>
                                            setOpenToWork(checked === true)
                                        }
                                    />

                                    <Label htmlFor="is_open_to_work">
                                        Open to work — recruiters can see you’re
                                        available
                                    </Label>
                                </div>

                                <InputError message={errors.is_open_to_work} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CandidateProfileEdit.layout = {
    breadcrumbs: [
        {
            title: 'My Profile',
            href: edit(),
        },
    ],
};
